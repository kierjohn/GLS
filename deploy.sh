systemctl stop mysql

cd /root/gls-fe

echo "pulling latest commit from the repo"
git reset --hard && git pull

echo "build should started start in a moments"
yarn install && yarn build:prod


cp -r /root/gls-fe/build/ /var/www/goleansigma.de/html/
systemctl restart nginx
systemctl start mysql
pm2 restart all

echo "Website and App has been deployed! Good luck!"