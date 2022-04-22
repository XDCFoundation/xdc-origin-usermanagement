import { apiSuccessMessage, apiFailureMessage, httpConstants } from '../../common/constants'
const db = require('../../../database/models/index');
const client = db.Client;
var jwt = require('jsonwebtoken');
import Config from "../../../config"


export default class Manger {
    // API business logic
    login = async (requestData) => {
        try{
            // const newUser = {
            //         userId: requestData.xdcPayAddress,
            //         xdcPayAddress: requestData.xdcPayAddress,
            //     }
            // const userDetails = await user.findAll({
            //     where: {
            //         "xdcPayAddress": requestData.xdcPayAddress
            //     }
            // });
            // if(userDetails.length == 0){
            //     const response = await user.create(newUser);
            //     await user.update(
            //         { userId: response.id },
            //         { where: { id: response.id } },
            //       )
            //     return await user.findAll({
            //         where: {
            //             "xdcPayAddress": response.xdcPayAddress
            //         }
            //     })
            // }else{
            //     return userDetails
            // }

            // return client.create({
            //     "walletAddress": "abc",
            //     "sessionToken": "dbhc",
            //     "expiryTime": 2
            // });


            // return await userData.findAll();

            const { walletAddress } = requestData;
            let newData1= await client.findAll({where:{walletAddress:requestData.walletAddress}})
             console.log(newData1.id,"newData1")

            if(newData1){

                const token = jwt.sign(
                    { user_id: newData1.id, walletAddress },
                    Config.TOKEN_KEY,
                    {
                      expiresIn: "2h",
                    }
                  );
                    console.log(token,"token")
                  await client.update({sessionToken:token},{ where:{walletAddress:requestData.walletAddress}})
                  let newData= await client.findAll({where:{walletAddress:requestData.walletAddress}})
                  return  newData
                  

            }
            


        }
        catch (err) {
            throw new Error(err)
        }
    }


      // connect-wallet

      connectWallet = async (requestData)=>{
        try{

            const { expiryTime, walletAddress,sessionToken} = requestData;

            const oldUser = await client.findAll({ where:{walletAddress:requestData.walletAddress}});
            console.log("oldUser",oldUser)
  
            if (oldUser.length!==0) {
              login(requestData)
              return login(requestData)
            }

            const user = await client.create({
                // expiryTime:requestData.expiryTime, // it should be from admin
                walletAddress:requestData.walletAddress
              });

            const token = jwt.sign(
                { user_id: user.id, walletAddress },
                Config.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
              
             await client.update({sessionToken:token},{ where:{id:user.id}})
              let newData= await client.findAll({where:{id:user.id}})
              

              return {newData}
             

        }catch(e){
            console.log(e,"error")
        }
    }


    //wallet address and token needed
    authentication = async (requestData)=>{


      // const verifyToken = (req, res, next) => {
        const token =
          requestData.body.token || requestData.query.token || requestData.headers["x-access-token"];
          console.log(token.length,"token===")
        if (!token) {
            return "A token is required for authentication"
          }
        const address=
          requestData.body.walletAddress || requestData.query.walletAddress || requestData.headers["wallet-address"];

          if (!address) {
            return "A token is required for authentication..."
          }
      
        try {
          const decoded = jwt.verify(token, Config.TOKEN_KEY);
          requestData.user = decoded;

          
        } catch (err) {
          // let expiredError=isTokenExpired(token)
          // if(expiredError===true){
          //   console.log("Token Expired")
          //   return "Token Expired"
          // }
            
          return "Invalid Token"
        }
        
        return "Welcome 🙌 "
    }

}

const login= async (requestData)=>{

  const { walletAddress } = requestData;
            let newData1= await client.findAll({where:{walletAddress:requestData.walletAddress}})
             console.log(newData1.id,"newData1")

            if(newData1){

                const token = jwt.sign(
                    { user_id: newData1.id, walletAddress },
                    Config.TOKEN_KEY,
                    {
                      expiresIn: "2h",
                    }
                  );
                    console.log(token,"token")
                  await client.update({sessionToken:token},{ where:{walletAddress:requestData.walletAddress}})
                  let newData= await client.findAll({where:{walletAddress:requestData.walletAddress}})
                  return  newData
                  

            }
}



function isTokenExpired(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  console.log(jsonPayload,"1111exp===============")
  const { exp } = JSON.parse(jsonPayload);
  console.log(exp,"exp===============")
  const expired = Date.now() >= exp * 1000
  return expired
}
