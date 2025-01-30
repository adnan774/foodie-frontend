pipeline {
    agent any
    environment {
        IMAGE_NAME = "angular-foodie-frontend"
    }
    stages {
        stage('Clone Repo') {
            steps {
                echo "Cloning GitHub repository"
                git branch: 'master', url: 'https://github.com/adnan774/foodie-frontend.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies"
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                echo "Building Angular app"
                dir('frontend') {
                    sh 'npm run build --prod'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image"
                sh 'docker build -t ${IMAGE_NAME} ./frontend'
            }
        }
        stage('Run Docker Container') {
            steps {
                echo "Running Docker container"
                sh 'docker run -d -p 4200:80 ${IMAGE_NAME}'
            }
        }
    }
}