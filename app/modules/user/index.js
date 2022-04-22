import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class Index {
  async login (request, response) {
    console.log('Inside login', request.body, 'login', 0, '')
    const [error, loginRes] = await Utils.parseResponse(new BLManager().login(request.body))
    if (!loginRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, loginRes, apiSuccessMessage.LOGGED_IN, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }


  async connectWallet (request, response) {
    console.log('Inside connectWallet', request.body, 'connectWallet', 0, '')
    const [error, connectWalletRes] = await Utils.parseResponse(new BLManager().connectWallet(request.body))
    if (!connectWalletRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, connectWalletRes, apiSuccessMessage.LOGGED_IN, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async authentication (request, response) {
    console.log('Inside authentication', request.body, 'authentication', 0, '')
    const [error, authenticationRes] = await Utils.parseResponse(new BLManager().authentication(request))
    if (!authenticationRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, authenticationRes, apiSuccessMessage.LOGGED_IN, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  
}
