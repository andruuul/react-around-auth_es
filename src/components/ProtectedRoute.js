import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, loggedIn, ...props }) {

  return (
    <>
      <Route>
        {() =>
          loggedIn 
          && (
//          ? (
            <>
            {console.log("loggedIn")}
            <h1 style={{color: "white"}}>ProtectedRoute loggedIn: TRUE</h1>
            <Component {...props} />
            </>
          ) 
//          : (
//            <>
//            {console.log("NOTloggedIn")}
//            <h1 style={{color: "white"}}>ProtectedRoute loggedIn: FALSE</h1>
//            <Redirect to='/signin' />
//            </>
//          )
        }
      </Route>
    </>  
  );  
}

export default ProtectedRoute;