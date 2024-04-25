import {useEffect, useState} from "react";
import {API_MANAGER} from "../APIs";
import {connect} from "react-redux";
import Header from "../Components/Header";
import {Col, Row, Table} from "antd";
import {
    CrossedEyeIcon,
    DeleteIcon,
    DollarIcon,
    EditWithoutBg,
    EmptyCartIcon,
    EyeIcon, ShapesIcon,
    ShoppingCartIcon
} from "../Utils/svg";
import EditModal from "../Components/EditModal";

const HomePage = ({totalProducts, totalStoreValue, outOfStock, categoryCount, items, userRole, updateInventoryData}) => {

    const [openEditModal, setOpenEditModal] = useState(false)
    const [selectedEntry, setSeletedEntry] = useState(null)
    const [isDataLoading, setIsDataLoading] = useState(false)

    useEffect(() => {
        getInventoryData()
    }, [])

    async function getInventoryData() {
        setIsDataLoading(true)
        try {
            const response = await API_MANAGER.getInventoryData()
            const widgetEntries = parseInventoryData(response?.data)
            const parsedItems = response?.data?.map((item, idx) => ({
                ...item,
                isVisible: true,
                id: idx
            }))
            updateInventoryData({
                ...widgetEntries,
                items: parsedItems
            })
        } catch (err) {}
        setIsDataLoading(false)
    }


    const parseInventoryData = (data) => {
        let totalProducts=0, totalStoreValue=0, outOfStock=0, categoryCount=0
        const categories = new Set()
        data?.forEach((item, idx) => {
            totalProducts += item?.quantity

            const productValue = parseInt(item?.value?.split('$')?.[1])
            if (productValue) totalStoreValue += productValue

            if (item?.quantity === 0) outOfStock += 1

            categories.add(item?.category)
            categoryCount = categories.size
        })
        return {
            totalProducts,
            totalStoreValue,
            outOfStock,
            categoryCount,
        }
    }

    const updateVisibility = (id, updatedVisibility) => {
        const updatedItems = items?.map(item => item?.id === id ? {...item, isVisible: updatedVisibility} : item)
        setDataToRedux(updatedItems)
    }

    const deleteRow = (id) => {
        const updatedItems = items?.filter(item => item?.id !== id)
        setDataToRedux(updatedItems)
    }

    const editRow = (id, data) => {
        const updatedItems = items?.map(item => item?.id === id ? {...item, category: data?.category, price: `$${data?.price}`, quantity: data?.quantity, value: `$${data?.value}`} : item)
        setDataToRedux(updatedItems)
    }

    const setDataToRedux = (updatedItems) => {
        const enabledRows = updatedItems?.filter(item => item?.isVisible)
        const widgetEntries = parseInventoryData(enabledRows)
        updateInventoryData({
            ...widgetEntries,
            items: updatedItems
        })
    }

    const widgets = [
        {
            label: 'Total Product',
            value: totalProducts,
            icon: <ShoppingCartIcon />
        },
        {
            label: 'Total Store Value',
            value: totalStoreValue,
            icon: <DollarIcon />
        },
        {
            label: 'Out of stocks',
            value: outOfStock,
            icon: <EmptyCartIcon />
        },
        {
            label: 'No of category',
            value: categoryCount,
            icon: <ShapesIcon />
        }
    ]

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Value',
            dataIndex: 'value',
        },
        {
            title: 'Action',
            dataIndex: '_',
            render: (_, rowData) => (
                <div className={'action-main d-flex align-items-center justify-content-center g-10'}>
                    <EditWithoutBg
                        onClick={() => {
                            setSeletedEntry(rowData)
                            setOpenEditModal(true)
                        }}
                        className={'hover-pointer'}
                        isDisabled={userRole === 'user' || !rowData?.isVisible}
                    />
                    {rowData?.isVisible ?
                        <EyeIcon
                            className={'hover-pointer'}
                            onClick={() => updateVisibility(rowData?.id, false)}
                            isDisabled={userRole === 'user'}
                        />
                        :
                        <CrossedEyeIcon
                            className={'hover-pointer'}
                            onClick={() => updateVisibility(rowData?.id, true)}
                            isDisabled={userRole === 'user'}
                        />
                    }
                    <DeleteIcon
                        className={'hover-pointer'}
                        onClick={() => deleteRow(rowData?.id)}
                        isDisabled={userRole === 'user'}
                    />
                </div>
            )
        }
    ]

    return (
        <>
            <Header />
            <section className={'inventory-main'}>
                <h1>Inventory Stats</h1>
                <Row gutter={16}>
                    {widgets.map((widget, idx) => (
                       <Col span={6} key={idx}>
                            <div className={'widget-main d-flex g-10'}>
                                <div className={'icon-main'}>
                                    {widget.icon}
                                </div>
                                <div className={'content-main'}>
                                    <div className={'heading'}>{widget.label}</div>
                                    <h1 className={'value'}>
                                        {widget.value}
                                    </h1>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
                <Table
                    loading={isDataLoading}
                    dataSource={items}
                    columns={tableColumns}
                    pagination={null}
                    className={'pt-20'}
                />
            </section>
            <EditModal
                item={selectedEntry}
                editItemCallback={editRow}
                setShowPopup={setOpenEditModal}
                showPopup={openEditModal}
            />
        </>
    )
}

const mapStateToProps = (state) => ({
  totalProducts: state.inventoryData.totalProducts,
  totalStoreValue: state.inventoryData.totalStoreValue,
  outOfStock: state.inventoryData.outOfStock,
  categoryCount: state.inventoryData.categoryCount,
  items: state.inventoryData.items,
  userRole: state.user.role
});

const mapDispatchToProps = (dispatch) => ({
  updateInventoryData: (data) => dispatch({ type: "UPDATE", payload: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)