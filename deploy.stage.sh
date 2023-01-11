systemctl stop mysql

cd /root/gls-fe-stage

echo "pulling latest commit from the repo"
git reset --hard && git pull

echo "build should started start in few moments"
yarn install && yarn build:stage


cp -r /root/gls-fe-stage/build/ /var/www/stage.goleansigma.de/html/
systemctl restart nginx
systemctl start mysql
pm2 restart all

echo "Website and App has been deployed on Staging! Happy testing!"