import './App.css';
import { useEffect } from 'react';
import {Switch,Route} from 'react-router-dom';
import Login from './Components/login';
import Home from './Components/home';
import Courses from './Components/courses';
import Reports from './Components/reports';
import Manageusers from './Components/manageusers';
import Myaccount from './Components/myaccount';
import ManageOrders from './Components/manageorders';
import Instructor from './Components/instructor';
import Error from './Components/error';
import CustomerSupport from './Components/customerSupport';
import PrivateRoute from './Components/private';
import AddCredentials from "./Components/addCourse";

function App() {
  useEffect(()=>{
    document.body.style.overflowX="hidden";
  },[])
  return (
    <div className="App">
     <Switch>
      <Route exact path="/" component={Login}/>
      <PrivateRoute path="/manage-orders" component={ManageOrders}/>
      <PrivateRoute path="/dashboard" component={Home}/>
      <PrivateRoute path="/courses" component={Courses}/>
      <PrivateRoute path="/instructor" component={Instructor}/>
      <PrivateRoute path="/reports" component={Reports}/>
      <PrivateRoute path="/manage-users" component={Manageusers}/>
      <PrivateRoute path="/my-accounts" component={Myaccount}/>
      <PrivateRoute path="/customer-support" component={CustomerSupport}/>
      <PrivateRoute path="/addCourse" component={AddCredentials}/>
      <Route path="/404" component={Error}/>
     </Switch>
    </div>
  );
}

export default App;
