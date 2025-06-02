// import { Checkbox, Rate } from 'antd'
// import React from 'react'
// import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'

// const NavBarComponent = () => {
//     const onChange = () =>{ }
//     const renderContent = (type, options) => {
//         switch ( type) {
//             case 'text':
//                 return options.map((option) => {
//                     return (
//                             <WrapperTextValue>{option}</WrapperTextValue>
//                     )
//                 })
//             case'checkbox' :
//                 return  (
//                 <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
//                     {options.map((option) => {
//                         return (
//                             <Checkbox style={{ marginLeft: 0 }} value={option.value}>{option.label}</Checkbox>
//                         )
//                     })}
//                     </Checkbox.Group>
//                 )
//                 case'star' :
//                 return  options.map((option) => {
//                         return (
//                             <div style={{ display: 'flex', gap: '5px' }}>
//                                 <Rate style = {{ fontSize: '12px' }} disabled defaultValue={option} />
//                                 <span>{ `từ ${option}  sao`}</span>
//                             </div>
//                         )
//                     })
//                 case'price' :
//                     return  options.map((option) => {
//                             return (
//                                 <WrapperTextPrice>{option}</WrapperTextPrice>
//                             )
//                     })    
//             default:
//                 return {}
//         }
//     }

//   return (
//     <div>
//         <WrapperLabelText>Label</WrapperLabelText>
//         <WrapperContent>
//             {renderContent ('text', ['Camera', 'Smartphone', 'TV'])}
//         </WrapperContent>
//     </div>
//   )
// }

// export default NavBarComponent

import { Checkbox } from 'antd'
import React, { useState, useMemo } from 'react'
import { WrapperTextValue } from './style'
import { WrapperNavbar } from '../../pages/TypeProductPage/style'

const NavBarComponent = ({ products = [], onSelectType }) => {
    const [checkedValues, setCheckedValues] = useState([])

    // Lấy danh sách type duy nhất từ products
    const uniqueTypes = useMemo(() => {
        const types = products.map(p => p.type)
        return Array.from(new Set(types))
    }, [products])

    const onChange = (checkedValues) => {
        setCheckedValues(checkedValues)
        if (onSelectType) {
            onSelectType(checkedValues) // gửi ra ngoài mảng các loại được chọn
        }
    }

    return (
        <WrapperNavbar>
            <h3>Loại sản phẩm</h3>
            <Checkbox.Group
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                onChange={onChange}
                value={checkedValues}
            >
                {uniqueTypes.map(type => (
                    <Checkbox key={type} value={type}>{type}</Checkbox>
                ))}
            </Checkbox.Group>
        </WrapperNavbar>
    )
}

export default NavBarComponent
