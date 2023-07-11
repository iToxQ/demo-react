import Styles from './NavbarGroup.module.scss'
import NavbarButton from '../NavbarButton/NavbarButton'

const NavbarGroup = ({group}: any) => {
    return (
        <div className={Styles.NavbarGroup__group}>
            <div className={Styles.NavbarGroup__button_list}>
                {group.buttons.map((button: any) =>
                    <NavbarButton button={button} key={button.label}/>
                )}
            </div>
            <div className={Styles.NavbarGroup__name}>
                {group.name}
            </div>
        </div>
    )
}

export default NavbarGroup;