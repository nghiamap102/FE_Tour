import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function MyCard(props){
    let path = ""
    // if(props.type ==='lesson'){
    //     path = `/lessons/${props.obj.id}`
    // }
    // else
    //     path = `/courses/${props.obj.id}/lessons/`
    
    if(props.type ==='tour'){
        path = `/tour_detail/${props.obj.id}/`
    }
    else
        path = `/tours/${props.obj.id}/detail/`

    return(
        <Col md={4} xs={12}>
            <Card >
                <Link to={path}>
                    <Card.Img variant="top" src={props.obj.image} Fluid/>
                </Link>                    
            <Card.Body>
                <Card.Title>{props.obj.name}</Card.Title>
                <Card.Text>
                    Ngay Tao: {props.obj.created_date}
                </Card.Text>
           </Card.Body>
            </Card>
        </Col>
    )
}