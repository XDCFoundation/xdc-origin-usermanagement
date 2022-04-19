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


    register = async (requestData)=>{
        try{

            const { expiryTime, walletAddress,sessionToken} = requestData;

            const user = await client.create({
                expiryTime:requestData.expiryTime, 
                walletAddress:requestData.walletAddress
              });

            const token = jwt.sign(
                { user_id: user.id, walletAddress },
                Config.TOKEN_KEY,
                {
                  expiresIn: requestData.expiryTime,
                }
              );
              
             await client.update({sessionToken:token},{ where:{id:user.id}})
              let newData= await client.findAll({where:{id:user.id}})
              

              return newData
             

        }catch(e){
            console.log(e,"error")
        }
    }

    authentication = async (requestData)=>{

        return "Welcome 🙌 "

    }

}
