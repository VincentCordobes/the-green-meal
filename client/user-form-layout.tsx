import {FC} from "react"
import Card from "antd/lib/card"
import Row from "antd/lib/row"
import Col from "antd/lib/col"

type Props = {
  title: string
}
export const UserFormLayout: FC<Props> = props => {
  return (
    <Row>
      <Col md={{span: 24}} lg={{span: 16, offset: 4}}>
        <Card>
          <h3>{props.title}</h3>
          {props.children}
        </Card>
      </Col>
    </Row>
  )
}
