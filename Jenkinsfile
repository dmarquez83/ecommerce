pipeline {
  agent any
  stages {
    stage('Build') {
      agent {
        docker {
          image 'node'
          args '-p 3008:3008'
        }

      }
      steps {
        echo 'Start Build'
        sh 'npm install && npm run build:dev'
      }
    }

    stage('Restart Nginx and pm2') {
      steps {
        sh 'ssh -i /var/jenkins_home/jenkins-dev desarrollolibreoferta@34.71.19.126 -yes \'sudo rm -rfv /home/desarrollolibreoferta/backend_services/*; sudo cp -a -v /home/jenkins/jenkins_home/workspace/backend_services_develop@2/. /home/desarrollolibreoferta/backend_services; sudo cp -a -v /home/desarrollolibreoferta/conf_backend/. /home/desarrollolibreoferta/backend_services; sudo systemctl restart nginx; pm2 restart backend; exit;  bash -l\''
      }
    }

    stage('Deploy') {
      steps {
        echo 'App is deployed'
      }
    }

  }
  triggers {
    cron('H 2 * * *')
  }
}