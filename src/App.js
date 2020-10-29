import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo  from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecoginition';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const app = new Clarifai.App({
  apiKey: 'd1f06ad249a546fc8e5ae5df0e742bfa   '
 });
const particleObj={
  particles: {
    number:{
      value:100,
      density:{
        enabled:true,
        value_area:800
      }
    }
  }
}
class App extends React.Component{
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box: {},
      route:'signin',
      isSignedIn: false
    }
  }
  
displayFaceBox=(box)=>{
  console.log(box);
  this.setState({box: box});
}
  calculateFaceLocation = (data) => {
    // console.log(data);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }
  onSubmitClick=()=>{
      this.setState({imageUrl:this.state.input});
      app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(faceDetect => {
        return faceDetect.predict(this.state.input);
      })
      .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=>console.log(err))
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render(){
  
    return(
      <div className="App">
      <Particles className='particles'
                params={particleObj}
              />
       <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}  />
        {
          this.state.route==='home'
          ?
            <div>  
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmitClick={this.onSubmitClick} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          :
            (
              this.state.route==='signin'
              ?
                <Login onRouteChange={this.onRouteChange}/>
              :
                <Register onRouteChange={this.onRouteChange}/>
            )
          
          
      }
      </div>

    )
  }
}
export default App;
