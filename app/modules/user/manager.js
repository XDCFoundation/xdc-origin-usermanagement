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
        Config.TOKEN_KEY,
        {
          expiresIn: httpConstants.EXPIRESIN,
        }
      );

      await client.update({ sessionToken: token }, { where: { id: user.id } });
      let newData = await client.findAll({ where: { id: user.id } });

      return { newData };
    } catch (e) {
      console.log(e, "error");
    }
  };

  
  authentication = async (requestData) => {

    const token =
      requestData.body.token ||
      requestData.query.token ||
      requestData.headers["x-access-token"];
    
    if (!token) {
      
      return "A token is required for authentication";
    }
    const address =
      requestData.body.walletAddress ||
      requestData.query.walletAddress ||
      requestData.headers["wallet-address"];

    if (!address) {
      return "A token is required for authentication...";
    }

    const checkUser = await client.findAll({
      where: { walletAddress: address },
    });

    if(checkUser.length===0){
      return "No user Found"
    }

    try {
      const decoded = jwt.verify(token, Config.TOKEN_KEY);
      requestData.user = decoded;

    } catch (err) {
      if(err.expiredAt){
        return "Token Expired"
      }

      return "Invalid Token";
      
      
    }
    
    return "Welcome 🙌 ";
  };
}

const login = async (requestData) => {
  const { walletAddress } = requestData;
  let newData1 = await client.findAll({
    where: { walletAddress: requestData.walletAddress },
  });
  console.log(newData1.id, "newData1");

  if (newData1) {
    const token = jwt.sign(
      { user_id: newData1.id, walletAddress },
      Config.TOKEN_KEY,
      {
        expiresIn: httpConstants.EXPIRESIN,
      }
    );
    console.log(token, "token");
    await client.update(
      { sessionToken: token },
      { where: { walletAddress: requestData.walletAddress } }
    );
    let newData = await client.findAll({
      where: { walletAddress: requestData.walletAddress },
    });
    return newData;
  }
};
