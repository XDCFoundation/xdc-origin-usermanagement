import {
  httpConstants,
} from "../../common/constants";
const db = require("../../../database/models/index");
const client = db.Client;
var jwt = require("jsonwebtoken");
import Config from "../../../config";

export default class Manger {
  connectWallet = async (requestData) => {
    try {
      const {  walletAddress} = requestData;

      const oldUser = await client.findAll({
        where: { walletAddress: requestData.walletAddress },
      });

      if (oldUser.length !== 0) {
        login(requestData);
        return login(requestData);
      }

      const user = await client.create({
        walletAddress: requestData.walletAddress,
      });

      const token = jwt.sign(
        { user_id: user.id, walletAddress },
        Config.JWT_TOKEN_KEY_1,
        {
          expiresIn: httpConstants.EXPIRESIN,
        }
      );

      const decoded = jwt.verify(token, Config.JWT_TOKEN_KEY_1);

      await client.update({ sessionToken: token ,expiryTime:decoded.exp}, { where: { id: user.id } });
      let newData = await client.findAll({ where: { id: user.id } });

      return { newData };
    } catch (e) {
      console.log(e, "error");
    }
  };

  
  authentication = async (requestData) => {

    const token =
      requestData.body.token
    
    if (!token) {

      return "A token is required for authentication";
    }
    const address =
      requestData.body.walletAddress

    if (!address) {
      return "A wallet address is required for authentication";
    }

    const checkUser = await client.findAll({
      where: { walletAddress: address },
    });

    if(checkUser.length===0){
      return "No user Found"
    }

    try {
      const decoded = jwt.verify(token, Config.JWT_TOKEN_KEY_1);
      requestData.user = decoded;

      const user = await client.findAll({
        where: { walletAddress: decoded.walletAddress,id:decoded.user_id,sessionToken:requestData.body.token },
      });
      if(user.length===0){
        return "Invalid User"
      }

    } catch (err) {
      if(err.expiredAt){
        return "Token Expired"
      }

      return "Invalid Token";
      
      
    }
    return "User Verified";
  };
}

const login = async (requestData) => {
  
  const walletAddress = requestData.walletAddress;
  let newData1 = await client.findAll({
    where: { walletAddress: requestData.walletAddress },
  });

  if (newData1) {
    const token = jwt.sign(
      { user_id: newData1[0].id, walletAddress },
      Config.JWT_TOKEN_KEY_1,
      {
        expiresIn: httpConstants.EXPIRESIN,
      }
    );

    await client.update(
      { sessionToken: token,expiryTime:decoded.exp },
      { where: { walletAddress: requestData.walletAddress } }
    );
    let newData = await client.findAll({
      where: { walletAddress: requestData.walletAddress },
    });
    return newData;
  }
};
