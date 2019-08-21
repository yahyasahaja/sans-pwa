export const indexstyles = theme => ({
  base : {
    position : 'absolute',
    width    : '100%',
  },
  paper : { 
    [theme.breakpoints.up('sm')]: {
      width: 600, 
    },
    width     : '100%',
  },
})

export const containerStyles = theme => ({
  base : {
    marginBottom : 100
  }
})

export const pictureStyles = theme => ({
  base : {
    width  : '100%',
    height : 400,
    //border : 'solid'
  },
  icon : {
    fontSize : 150,
  },
  avatar : {
    width  : 200,
    height : 200,
  }
})

export const inputformStyles = theme => ({
  textField : {
    width : '70%',
  }
})

export const submitStyles = theme => ({
  button : {
    width     : '70%',
    height    : 60,
    marginTop : 100,
  },
  text : {
    fontSize : 20
  }
})