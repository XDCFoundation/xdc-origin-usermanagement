/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import TestModule from "../app/modules/testModule";
import {apiEndpoints, stringConstants} from "../app/common/constants";
import User from '../app/modules/user'

module.exports = (app) => {
    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

    /**
     * route definition
     */
    app.get("/test-route", new TestModule().testRoute);
    app.post(apiEndpoints.LOGIN, ValidationManger.validateUserLogin, new User().login)
};
