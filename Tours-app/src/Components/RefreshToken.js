



export const refreshTokenSetup = (res) =>{
    let refresTiming = (res.tokenObj.expires_in || 3600-5*60) *1000
    const refressToken = async ()=>{
        const newAuthRes = await res.reloadAuthResponse()
        refresTiming = (newAuthRes.expires_in || 3600-5*60)*1000
        console.log('newAuthRes: ', newAuthRes)
        console.log('new auth Token', newAuthRes.id_token)

        setTimeout(refressToken,refresTiming)
    }

    setTimeout(refressToken,refresTiming)
}