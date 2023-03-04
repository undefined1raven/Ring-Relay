


function DomainGetter(ENV_TYPE){
    if(ENV_TYPE == 'devx'){
        return 'http://localhost:3001/';
    }else if(ENV_TYPE == 'prodx'){
        return 'https://ring-relay-api-prod.vercel.app/';
    }
}


export default DomainGetter;