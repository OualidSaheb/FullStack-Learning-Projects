cd /var/www/rxserver
git pull origin develop
npm i
pm2 restart rxserver
echo 'Deploy finished.' 
