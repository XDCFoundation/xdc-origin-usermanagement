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


  async register (request, response) {
    console.log('Inside register', request.body, 'register', 0, '')
    const [error, registerRes] = await Utils.parseResponse(new BLManager().register(request.body))
    if (!registerRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, registerRes, apiSuccessMessage.LOGGED_IN, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async authentication (request, response) {
    console.log('Inside authentication', request.body, 'authentication', 0, '')
    const [error, authenticationRes] = await Utils.parseResponse(new BLManager().authentication(request.body))
    if (!authenticationRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, authenticationRes, apiSuccessMessage.LOGGED_IN, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  
}
