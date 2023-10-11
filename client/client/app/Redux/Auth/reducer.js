import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTERE_FAILURE, REGISTERE_REQUEST, REGISTERE_SUCCESS } from "./actionType";

const intialstate = {
  isLoading: false,
  isError: false,
  token: "",
  isAuth:false,
  activationCode: "",
};

export const reducer = (state = intialstate, action) => {
  switch (action.type) {
    case REGISTERE_REQUEST: {
      return {
        isLoading: true,
        isError: false,
        token: "",
        activationCode: "",
      };
    }
    case REGISTERE_SUCCESS: {
        return {
          isLoading: false,
          isError: false,
          token:action.payload.token,
          activationCode:action.payload.activationCode,
        };
      }

      case REGISTERE_FAILURE: {
        return {
          isLoading: false,
          isError: true,
          token:"",
          activationCode:"",
        };
      }

      case LOGIN_REQUEST:{
        return {
          isLoading: true,
          isError: false,
          isAuth:false,
        }
      }

      case LOGIN_SUCCESS:{
        return {
          isLoading: false,
          isError: false,
          isAuth:true,
        }
      }

    

      case LOGIN_FAILURE:{
        return {
          isLoading: false,
          isError: false,
          isAuth:false,
        }
      }
      default:{
        return state
      }
  }
};
