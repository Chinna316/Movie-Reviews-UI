import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideoSlash } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import Container from 'react-bootstrap'
import { Nav } from 'react-bootstrap'
import { Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import React from 'react'

const Header = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='1g'>
        <Container fluid>
            <Navbar.Brand href='/' style={{'color':'gold'}}>
                <FontAwesomeIcon icon={faVideoSlash}/>Gold
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='navbarScroll' />
        </Container>
    </Navbar>
  )
}

export default Header