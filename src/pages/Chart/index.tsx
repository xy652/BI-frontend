import React, {useEffect, useState} from "react";
import {listChartByPageUsingPost} from "@/services/BI/chartController";
import {Card, List, message, Result} from "antd";
import ReactECharts from "echarts-for-react";
import Search from "antd/es/input/Search";

const ChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,//当前页
    pageSize: 4,//每页展示的数量
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  //传给后端的参数
  const [searchParams,setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})
  //后端返回的图表数据
  const [chartList,setChartList] = useState<API.Chart[]>();
  //返回发图表数据总数
  const [total,setTotal] = useState<number>(0);
  //设置加载状态
  const [loading, setLoading] = useState<boolean>(true);
  const loadData = async () =>{
    setLoading(true);
    try {
      const res = await listChartByPageUsingPost(searchParams);
      if(res.data){
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
      } else{
        message.error('获取图表失败');
      }
    } catch (e : any) {
      message.error('获取图表失败' + e.message);
    }
    setLoading(false);
  };
  useEffect(() =>{
    loadData();
  },[searchParams]);

  return(
    <div className="chart_page">
      <div>
        <Search placeholder="请输入图表名称" enterButton loading={loading} onSearch={(value) => {
          // 设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div style={{marginBottom: 16}}></div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{width: '100%'}}>
              <List.Item.Meta
                title={item.name}
                description={item.chartType ? ('图表类型：' + item.chartType) : undefined}
              />
              <>
                {
                  item.status === 'wait' && <>
                  <Result
                    status="warning"
                    title="待生成"
                    subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等待'}>
                  </Result>
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}>
                    </Result>
                  </>
                }
                {
                  item.status === 'succeed' && <>
                    <div style={{marginBottom: 16}}></div>
                    <p>{'分析目标：' + item.goal}</p>
                    <div style={{marginBottom: 16}}></div>
                    <ReactECharts option={JSON.parse(item.genChart ?? '{}')}></ReactECharts>
                    <p>{'分析结论：' + item.genResult}</p>
                  </>
                }
                {
                  item.status === 'failed' && <>
                    <Result
                      status="error"
                      title="图表生成失败"
                      subTitle={item.execMessage}>
                    </Result>
                  </>
                }
              </>
            </Card>
          </List.Item>
        )}
      />
      总数：{total}
    </div>
  )
}

export default ChartPage;
