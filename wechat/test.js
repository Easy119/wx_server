
function enterListSubmit() {
    accept();
    var isValid = $(this).form('validate');
    if (!isValid) {
        return;
    }
    var reservationPersonssJsonString = JSON.stringify(datagridData.rows);
    $('#enterRegisterForm').form('submit', {
        url: '/enterregister/save/enterInfo',
        queryParams: JSON.stringify({
            reservationPersons: reservationPersonssJsonString
        }),
        success: function (result) {
            result = $.parseJSON(result);
            if (result.success) {
                progressClose();
                parent.$.modalDialog.handler.dialog('close');
            } else {
                parent.$.messager.alert('提示', result.message, 'warning');
            }
        }
    })
}