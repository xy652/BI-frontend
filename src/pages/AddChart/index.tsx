import React, {useState} from "react";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, message, Row, Select, Space, Spin, Upload} from 'antd';
import {getChartByAiUsingPost} from "@/services/BI/chartController";
import ReactECharts from 'echarts-for-react';

const AddChart: React.FC = () => {

  //保存生成图表信息，以便在前端页面展示
  const [chart,setChart] = useState<API.BiResponse>();
  const [submitting,setSubmitting] =useState<boolean>(false);

  const onFinish = async ( values:any) => {
    //如果已经提交，则直接return，避免重复提交
    if(submitting){
      return;
    }
    setSubmitting(true);
    //对接后端，上传数据
    const params ={
      ...values,
      file:undefined
    }
    try{
      const res = await getChartByAiUsingPost(params,{},values.file.file.originFileObj)
      console.log(res);
      if(!res?.data){
        message.error('分析失败' );
      } else{
        message.success('分析成功');
        setChart(res.data);
        }

    } catch (e:any){
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return(
    <div className="add_chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form name="addChart" labelAlign="left" labelCol={{span:4}}
                  wrapperCol={{span:16}} onFinish={onFinish} initialValues={{}}>
              <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标'}]}>
                <TextArea placeholder="请输入你的分析诉求，比如：分析网站用户的增长情况"/>
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <TextArea placeholder="请输入要生成的图表名称"/>
              </Form.Item>
              <Form.Item name="chartType" label="图表类型">
                <Select
                  options={[
                    {value: '折线图', label: '折线图'},
                    {value: '柱状图', label: '柱状图'},
                    {value: '堆叠图', label: '堆叠图'},
                    {value: '饼图', label: '饼图'},
                    {value: '雷达图', label: '雷达图'},
                  ]}
                  placeholder="请选择图表类型">
                </Select>
              </Form.Item>

              <Form.Item name="file" label="原始数据">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传 CSV 文件</Button>
                </Upload>
              </Form.Item>


              <Form.Item wrapperCol={{span: 16, offset:4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧提交数据</div>}
            <Spin spinning={submitting}></Spin>
          </Card>
          <Divider></Divider>
          <Card title="可视化图表">
            {
              chart?.genChart ? <ReactECharts option={JSON.parse(chart?.genChart)}></ReactECharts> :
                <div>请先在左侧提交数据</div>
            }
            <Spin spinning={submitting}></Spin>
          </Card>
        </Col>
      </Row>


    </div>

  )
}

export default AddChart;

