## Deploying to the server:
* Build locally by running `lerna run build` from the root folder
* Commit and push to Bitbucket
* Logon to server `ssh -i ~/.ssh/id_rsa ubuntu@ec2-34-247-213-155.eu-west-1.compute.amazonaws.com`
* `cd /var/www/gaw_client_apps`
* `lerna bootstrap` to install npm dependencies for each project
* `lerna build` to build a front-end
* `pm2 list` to show the list
* `git pull <user> <branch>` e.g. `git pull daniel demo_blockchain`
* `pm2 restart npm` to restart the server

## To wipe the database and/or restart the blockchain on the server (run process as daemon):
* `nohup {command} &`

## Errors:
* If getting `Uncaught SyntaxError: Unexpected Token <` it might be because build files are not checked in to git and therefore not available in the server