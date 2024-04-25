import {connect} from "react-redux";
import {useEffect} from "react";
import {Switch} from "antd";

const Header = ({userRole, updateUserRole}) => {

    const updateRole = (val) => {
        let updatedRole = val ? 'user' : 'admin'
        updateUserRole({userRole: updatedRole})
    }

    return (
        <header className={'header-main d-flex justify-content-end'}>
            <div className={'user-role-main d-flex align-items-center g-10'}>
                <span className={'user-role'}>admin</span>
                <Switch onChange={updateRole}/>
                <span className={'user-role'}>user</span>
            </div>
        </header>
    )

}

const mapStateToProps = (state) => ({
  userRole: state.user.role
});

const mapDispatchToProps = (dispatch) => ({
  updateUserRole: (data) => dispatch({ type: "UPDATE-ROLE", payload: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header)