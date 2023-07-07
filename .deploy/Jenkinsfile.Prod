#!groovy
import com.mapfre.pod.Container
import com.mapfre.pod.ContainerType
import com.mapfre.pod.ContainerTypeCustom
import com.mapfre.pod.ContainerSize
import com.mapfre.sonar.SonarScannerType

@Library(['global-pipeline-library', 'security_library','pe-common-pipeline-config']) _

def DEVOPS_PLATFORM_ORGANIZATION = 'org-mapfreperu'

def libModules = '.deploy/libModules.yml'

pipeline {
    agent {
        kubernetes {
            yaml getYmlBuildPod('oim')
        }
    }
   
    options {
        timeout(time: 25, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '30', artifactNumToKeepStr: '30'))
    }
    environment {
        // Current version
        PACKAGE_VERSION        = getFieldFromPackage("version")
        PACKAGE_NAME           = getFieldFromPackage("name")
        ENTORNO             =  getEnvironment(env.BRANCH_NAME)        
    }
    stages {
        stage('Prepare Environment') {
            steps {
                prepareEnvironment()
            }
        }
        stage('Prepare sources') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                }
            }            
            steps {
                script() {
                    try {
                        exitCode = prepareSource(params.LISTABRANCHE)
                        if (exitCode != 0) {
                            error('Error in prepareSource: ' + exitCode)
                        }
                    } catch (Exception err) {
                        error('Error prepareSource : ' + err)
                    }
                }                
            }
        }         
        stage('Prepare Promotion') {
            when {
                anyOf {
                    branch 'master';branch 'develop'; branch 'hotfix/*'
                    expression {
                        return env.BRANCH_NAME.startsWith('release') 
                    }
                }
            }
            steps {
                container('node') {
                    promotionNpmPeru(env.BRANCH_NAME, env.PACKAGE_VERSION)
                }
            }
        }

        //This is a security stage that must be executed before building any code or image.
        stage('Security pre-build'){
            steps{
                script{
                    secPreBuild()
                }
            }
        }   
        
        stage('Build Auditoria') {
            steps {
                container('node') {
                    sh("""
                        printenv
						cp -R client/wwwroot/referencia/ $WORKSPACE/
                        cd $WORKSPACE/referencia
						ls -la
                        node -v
                        npm -v
 						npm install
						npm run $ENTORNO
						rm -rf node_modules
						rm -rf $WORKSPACE/client/wwwroot/referencia
						cp -R $WORKSPACE/referencia/ $WORKSPACE/client/wwwroot/
					""")                    
                }                
            }
        }

        stage('Build & Unit Test') {
            steps {
                container('node') {
                    sh("""
                        printenv
						cd client
						ls -la
                        node -v
                        npm -v
						npm install
						bower i --force
						grunt -f build:$ENTORNO
						cp -R dist/ $WORKSPACE
						npm pack                        
					""")                    
                }                
            }
        }

        stage('SonarQube Analysis') {
            when {
                not {
                    branch 'PR*'
                }
            }      
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
            }                  
            steps {
                container('sonar'){
                     script {

                        def sonarConfig = getSonarConfiguration(PACKAGE_NAME)

                        if(sonarConfig.name==null) return

                        def projectKey = getSonarProyectoKey(sonarConfig, env.BRANCH_NAME)
                        def projectName = getSonarProyectoName(sonarConfig, env.BRANCH_NAME)
                        def extraParameter = "-Dsonar.projectVersion=${PACKAGE_VERSION}"

                        withSonarQubeEnv(installationName: SONAR_ENVIRONMENT, credentialsId: sonarConfig.projectKey, envOnly: true) {
                            println "Executing Sonar Scanner for Project Key ${projectKey}..."
                            println "Extra parameters: $extraParameter"
                            tee('output-sonar-scanner.log') {

                                        def params = "-Dsonar.sourceEncoding=UTF-8 ${extraParameter}"

                                            sh("""
                                                sonar-scanner \
                                                    -Dsonar.host.url='${env.SONAR_HOST_URL}' \
                                                    -Dsonar.login='${env.SONAR_AUTH_TOKEN}' \
                                                    -Dsonar.projectKey='${projectKey}' \
                                                    -Dsonar.projectName='${projectName}' \
                                                    ${params}
                                            """)
    
                                    
                            }
                        }                             
                     }
                }
            }
        }                   

        stage("Quality Gate"){
            when {
                not {
                    branch 'PR*'
                }
            }                 
           
            steps {

                container('sonar'){
                    script {
                        
                        def sonarConfig = getSonarConfiguration(PACKAGE_NAME)

                        if(sonarConfig.name==null) return

                        def sonarProyectoKey = getSonarProyectoKey(sonarConfig, env.BRANCH_NAME)

                        def status = checkQualityGatesPeru(SONAR_ENVIRONMENT,sonarConfig.projectKey,sonarProyectoKey)

                        if (status == "OK") {
                            println "Pasa el Quality Gates"
                        } else {
                            println "No pasa el quality Gates -> FAILED"
                            //error "Pipeline aborted due to quality gate failure: ${status}"
                        }
                        
                        
                    }
                }
            }
        }          

        stage('Publish') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                    branch 'master'
                }
            }
            steps {
                container('node') {
                    script() {
                        publishNPMPeru()
                    }
                }
            }
        }

        stage('Commit and Tag Promotion') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                    branch 'master'
                }
            }
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")

            }
            steps {
                gitFetch()
                gitCheckout env.BRANCH_NAME

                script {
                    def msg = 'release'
                    if (BRANCH_NAME.startsWith('release')) {
                        msg = 'release candidate'
                    }                 
                    gitCommitPackage  "promotion to " + msg + " completed (" + PACKAGE_VERSION + ")"
                    gitPush()
                    gitTag(PACKAGE_VERSION,  "New " + msg + " tag " + PACKAGE_VERSION)
                    gitPushTags()
                    
                }

            }

        }        

        stage('Security post-build'){
            steps {
                script{
                    secPostBuild()
                }
            }
        }


        stage('Security pre-deploy'){
            steps{
                script{
                    secPreDeploy()
                }
            }
        }   

        stage('Deploy to Frontal') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                    branch 'master'
                }
            }
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")
            }
            steps {
                retry(3) {
                    container('node') {
                        script() {
                            try {
                                packNPMPeru(env.PACKAGE_NAME,env.PACKAGE_VERSION)
                                commandResult = deployCopyToFront(getProjectFromGit(GIT_URL),BRANCH_NAME, PACKAGE_NAME,PACKAGE_VERSION)
                                if (commandResult != 0) {
                                    error('ERROR EXITCODE deployCopyToFrontal: ' + commandResult)
                                }
                            } catch (Exception err) {
                                error('Error deploying to Frontal: ' + err)
                            }
                        }
                    }
                }                
            }
        }        

        stage('Security post-deploy'){
            steps{
                script{
                    secPostDeploy()
                }
            }
        }  

        stage ('Next Snapshot Promotion develop') {
            when {
				expression { return env.BRANCH_NAME == 'master' } 
            }
            environment {
                developBranch = "develop"
                PACKAGE_VERSION        = getFieldFromPackage("version")
            }
            steps {
                // promotion to snapshot after a release candidate is packaged and deployed
                // git checkout development
                gitCheckout developBranch

                gitMergeWithResolveConflicts("master")

               sh "cat .deploy/Jenkinsfile.NoProd > Jenkinsfile"

                container('node') {
                    promotionNpmPeru(developBranch,PACKAGE_VERSION)
                }

                // commit next snapshot in development branch
                gitCommitPackage "promotion to next snapshot completed (" + PACKAGE_VERSION + ")"
                // push all changes
                gitPush()
            }

        }        

        stage ('Next Snapshot Promotion release') {
            when {
                expression { return env.BRANCH_NAME == 'master' } 
            }
            environment {
                developBranch = "release"
                PACKAGE_VERSION        = getFieldFromPackage("version")
            }
            steps {
                // promotion to snapshot after a release candidate is packaged and deployed
                // git checkout development
                gitCheckout developBranch

                gitMergeWithResolveConflicts("master")

                sh "cat .deploy/Jenkinsfile.NoProd > Jenkinsfile"

                container('node') {
                    promotionNpmPeru(developBranch,PACKAGE_VERSION)
                }

                // commit next snapshot in development branch
                gitCommitPackage "promotion to next snapshot completed (" + PACKAGE_VERSION + ")"
                // push all changes
                gitPush()
            }
        }
       
    }
    post {
        always {
            echo '--always--'
            logstashSend failBuild: false, maxLines: 150000
        }
        success {
            echo '--success--'
        }
        failure {
            echo '--failure--'
            script {
                GIT_COMMIT_EMAIL = getCommitEmail()
            }
            echo "DESTINATARIO ${GIT_COMMIT_EMAIL}"
            sendFailureEmail GIT_COMMIT_EMAIL
        }
    }
}

def getEnvironment(String branchName) {

    def fileEnv = 'int'

    if (branchName.startsWith('develop')) {
        fileEnv = 'int'
    } else if (branchName.startsWith('release')) {
        fileEnv = 'pre'
    } else if (branchName.startsWith('master')) {
        fileEnv = 'prod'
    }

    println("  fileEnv = " + fileEnv)

    return fileEnv
}  
