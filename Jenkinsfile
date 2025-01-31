pipeline {
    agent any
    environment {
        IMAGE_NAME = "angular-foodie-frontend"
        CONTAINER_NAME = "foodie-frontend-container"
    }
    stages {
        stage('Clone Repo') {
            steps {
                echo "Cloning GitHub repository"
                git branch: 'master', url: 'https://github.com/adnan774/foodie-frontend.git'
            }
        }
        stage('Check Node.js & Install Dependencies') {
            steps {
                echo "Checking if Node.js and npm are installed"
                sh '''
                if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
                    echo "Node.js or npm not found! Ensure they are installed on Jenkins agent."
                    exit 1
                fi
                '''
                echo "Installing dependencies"
                sh 'npm install'
            }
        }
        stage('Build Frontend') {
            steps {
                echo "Building Angular app"
                sh 'npm run build --configuration=production'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image"
                sh 'docker build -t ${IMAGE_NAME} .'
            }
        }
        stage('Run Docker Container') {
            steps {
                echo "Stopping and removing existing container if any..."
                sh '''
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                '''

                echo "Running new Docker container"
                sh '''
                docker run -d --name ${CONTAINER_NAME} -p 80:80 --restart unless-stopped ${IMAGE_NAME}
                '''
            }
        }
    }
    post {
        success {
            script {
                def frontendIP = sh(script: '''hostname -I | awk '{print $1}' ''', returnStdout: true).trim()
                echo "Frontend is available at: http://${frontendIP}"
            }
        }
        failure {
            echo "Pipeline failed. Check logs for errors."
        }
    }
}
