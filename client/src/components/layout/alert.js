import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  )); // combine ui logic with alert state logic

Alert.propTypes = { alerts: PropTypes.array.isRequired }; // specify the properity type of 'alerts' to be {list + required} in order to render the Alert component

const mapStateToProps = (state) => ({
  alerts: state.alert,
}); // specify the redux alert slice as 'alerts'
export default connect(mapStateToProps)(Alert); // link the react component with the redux store props
