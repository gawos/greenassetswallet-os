
# Setting up postgresql for Postchain
* `sudo -u postgres -i`
* `createdb postchain`
* `psql -c “create role postchain LOGIN ENCRYPTED PASSWORD ‘postchain’”`
* `psql -c “grant ALL ON DATABASE postchain TO postchain”`
* `exit`

# Setting up gaw-client-apps
* `git clone git@bitbucket.org:chromawallet/gaw_client_apps.git`
* Run `lerna bootstrap`
* In ./apis/main do `npm run prepare-private-database` then `npm run populate-private-database`
* In ./blockchain/postchain-node run `./run-ann-test.sh` then `./run-ann.sh`
* In root app directory do `npm run api`
* In root app directory do `npm run admin`
* In root app directory do `npm run validator`
* In root app directory do `npm run investor`
* In root app directory do `npm run issuer`
