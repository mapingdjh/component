# 选择收件人组件功能：
=

1、页面初始化：创建dom节点，展示收件人列表和已选收件人(如果已经存在被选中的收件人)

2、搜索功能： 输入关键字后，单击搜索图标或enter键，发送ajax请求，查询相关收件人列表信息，如果有收件人被勾选了，那么改收件人也要在右侧已选收件人列表中显示出来；

3、单选或全选收件人在右侧已选收件人列表中显示出来，此时鼠标移动到已选收件人某行会在该行增加背景色且显示删除按钮

4、在已选收件人列表中单击删除某行，与左侧相对应的收件人取消勾选

5、取消勾选或在已选收件人列表中单击删除某行 都可以删除右侧已选收件人，此时清空相应dom节点，不需要发送请求与后台交互

6、单击新建按钮，保存已选收件。
