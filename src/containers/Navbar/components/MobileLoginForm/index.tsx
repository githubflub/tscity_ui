import * as React from 'react'

class MobileLoginForm extends React.Component {
   render() {
      return (            
         <div>
            <form>
               <div className="form-group">
                  <label>Account ID</label>
                  <input type="text" className="form-control" name="username"/>
               </div>

               <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password"/>
               </div>

               {/* Submit button */}
               <div className="form-group">
                  <button type="submit">Login</button>
               </div>                    
            </form>
         </div>
      )
   }
}

export default MobileLoginForm