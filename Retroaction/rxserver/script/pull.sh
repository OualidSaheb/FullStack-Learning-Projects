#/var/www/rxserver/script
echo 'Pull..'
cd /var/www/rxserver
git pull origin develop
npm i
pm2 restart rxserver
pm2 save
echo 'Deploy finished.' 
