import { apiSuccessMessage, apiFailureMessage, httpConstants } from '../../common/constants'
const db = require('../../../database/models/index');
const user = db.User;
export default class Manger {
    // API business logic
    login = async (requestData) => {
        try{
            const newUser = {
                    userId: requestData.xdcPayAddress,
                    xdcPayAddress: requestData.xdcPayAddress,
                }
            const userDetails = await user.findAll({
                where: {
                    "xdcPayAddress": requestData.xdcPayAddress
                }
            });
            if(userDetails.length == 0){
                const response = await user.create(newUser);
                await user.update(
                    { userId: response.id },
                    { where: { id: response.id } },
                  )
                return await user.findAll({
                    where: {
                        "xdcPayAddress": response.xdcPayAddress
                    }
                })
            }else if(userDetails.length !== 0){
                return userDetails
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }
}
