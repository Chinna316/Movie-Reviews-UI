import React from 'react'
import './Hero.css'
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'

const Hero = ({Movies}) => {
  return (
    <div className='movie-carousel-container'>
        <Carousel>
            {
                Movies.map((Movies) =>{
                    return(
                        <Paper>
                            <div className='movie-card-container'>
                                <div className='movie-card' style={{'--img': 'url(${Movie.backdrops[0]})'}}>
                                    <div className='movie-detail'>
                                        <div className='movie-poster'>
                                            <img src={Movies.poster} alt='' />
                                        </div>
                                        <div className='movie-title'>
                                            <h4>{Movies.title}</h4>
                                        </div>
                                        <div className='movie-button-container'>
                                            <div className='play-button-icon-container'>
                                                <FontAwesomeIcon className='play-button-icon'
                                                icon={faCirclePlay}
                                                />
                                            </div>
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