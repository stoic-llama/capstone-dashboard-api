pipeline {
    agent any
    environment {
        version = '1.0'
        containerName = 'capstone-dashboard-api'
    }

    stages {
        stage("login") {
            steps {
                echo 'authenticating into jenkins server...'
                sh 'docker login'
                // sh 'docker login registry.digitalocean.com'
                
                // note you need to manually add token for capstone-ccsu once 
                // in Jenkins conatiner that is in the droplet
                // Refer to "API" tab in Digital Ocean
                // sh 'doctl auth init --context capstone-ccsu'  
            }
        }

        stage("build") {
            steps {
                // echo 'building the application...'
                // sh 'doctl registry repo list-v2'
                // sh "docker build -t capstone-frontend:${version} ."
                // sh "docker tag capstone-frontend:${version} registry.digitalocean.com/capstone-ccsu/capstone-frontend:${version}"
                // sh "docker push registry.digitalocean.com/capstone-ccsu/capstone-frontend:${version}"
                // sh 'doctl registry repo list-v2'

                echo 'building the application...'
                // sh 'doctl registry repo list-v2'
                sh 'docker build -t "${containerName}:${version}" .'
                sh 'docker tag "${containerName}:${version}" stoicllama/"${containerName}:${version}"'
                sh 'docker push stoicllama/"${containerName}:${version}"'
                // sh 'doctl registry repo list-v2'
            }
        }

        stage("test") {
            steps {
                echo 'testing the application...'    
            }
        }

        stage("deploy") {
            steps {
                echo 'deploying the application...' 
                
                withCredentials([
                    string(credentialsId: 'website', variable: 'WEBSITE'),
                ]) {
                    script {
                        // Use SSH to check if the container exists
                        def containerExists = sh(script: 'ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key "${WEBSITE}" docker ps -q --filter name="${containerName}"', returnStatus: true) == 0

                        echo 'containerExists: '
                        echo "${containerExists}"

                        echo "${containerName}"

                        if (containerExists == true) {
                            echo "Container exists, stopping it..."

                            // Use SSH to stop the Docker container
                            sh(script: 'ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key "${WEBSITE}" docker stop ${docker ps -q --filter name="${containerName}"}')
                            echo "Container stopped successfully"
                        } else {
                            echo "Container does not exist, continuing..."
                        }
                    }
                }

                withCredentials([
                    string(credentialsId: 'website', variable: 'WEBSITE'),
                    string(credentialsId: 'mongodb_metrics', variable: 'MONGODB_METRICS'),
                ]) {
                    sh '''
                        ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key ${WEBSITE} "docker run -d \
                        -p 7100:7100 \
                        --rm \
                        -e DATABASE_URL=${MONGODB_METRICS} \
                        --name ${containerName} \
                        --network monitoring \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        stoicllama/${containerName}:${version}
                        
                        docker ps
                        "
                    '''
                }
            }

        }
    }

    post {
        always {
            echo "Release finished and start clean up"
            deleteDir() // the actual folder with the downloaded project code is deleted from build server
        }
        success {
            echo "Release Success"
        }
        failure {
            echo "Release Failed"
        }
        cleanup {
            echo "Clean up in post workspace" 
            cleanWs() // any reference this particular build is deleted from the agent
        }
    }

}