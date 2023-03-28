import React from 'react'
import './Hero.css'
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'

const Hero = ({Movies}) => {
  return (
    <div className='movie-carousel-container'>
        <Carousel>
            {
                Movies.map((Movies) =>{
                    return(
                        <Paper>
                            <div className='movie-card-container'>
                                <div className='movie-card'>
                                    <div className='movie-detail'>
                                        <div className='movie-poster'>
                                            <img src={Movies.poster} alt='' />
                                        </div>
                                        <div className='movie-title'>
                                            <h4>{Movies.title}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    )
                })
            }
        </Carousel>
    </div>
  )
}

export default Hero