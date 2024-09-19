import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './index.less';
import services from '@/services/ggl/app';
const { homepageStats } = services.AppRequest;

interface Stats {
  app_count: number;
  top_apps: { name: string; session_count: number }[];
  user_ranking: { username: string; session_count: number }[];
}

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    app_count: 0,
    top_apps: [],
    user_ranking: [],
  });

  const topAppsChartRef = useRef(null);
  const userRankingChartRef = useRef(null);
  const appCountChartRef = useRef(null);


  useEffect(() => {
    homepageStats().then((res) => {
      setStats(res.data);
    });
  }, []);

  // 渲染 Top 5 应用图表
  useEffect(() => {
    if (stats.top_apps.length > 0 && topAppsChartRef.current) {
      const chartInstance = echarts.init(topAppsChartRef.current);

      const option = {
        title: {
          text: 'Top 5 应用 (按会话数)',
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: stats.top_apps.map((app) => app.name),
          axisLabel: {
            fontSize: 14,
            fontWeight: 'bold',
            interval: 0
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: stats.top_apps.map((app) => app.session_count),
            type: 'bar',
            itemStyle: {
              color: '#4887F8',
            },
          },
        ],
      };

      chartInstance.setOption(option);
    }
  }, [stats.top_apps]);

  // 渲染用户排名图表
  useEffect(() => {
    if (stats.user_ranking.length > 0 && userRankingChartRef.current) {
      const chartInstance = echarts.init(userRankingChartRef.current);

      const option = {
        title: {
          text: '用户创建会话数排名',
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: stats.user_ranking.map((user) => user.username),
          axisLabel: {
            fontSize: 15,
            fontWeight: 'bold',
            interval: 0
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: stats.user_ranking.map((user) => user.session_count),
            type: 'bar',
            itemStyle: {
              color: '#81C653',
            },
          },
        ],
      };

      chartInstance.setOption(option);
    }
  }, [stats.user_ranking]);

  useEffect(() => {
    if (stats.app_count && appCountChartRef.current) {
      const chartInstance = echarts.init(appCountChartRef.current);

      const option = {
        title: {
          text: '应用创建总数',
          left: 'center'
        },
        series: [
          {
            type: 'gauge',
            detail: { formatter: '{value}' }, // 显示数值
            data: [{ value: stats.app_count, name: '总数' }],
          },
        ],
      };

      chartInstance.setOption(option);
    }
  }, [stats.app_count]);


  return (
      <PageContainer title={false} ghost>
        <div className={styles.homepage}>
          {/* 统计应用总数 */}
          <Card style={{ marginBottom: 24 }}>
            <div ref={appCountChartRef} style={{ width: '100%', height: '300px' }}></div>

          </Card>

          <div className={styles.chartsContainer}>
            <Card className={styles.chartCard}>
              <div ref={topAppsChartRef} style={{ width: '100%', height: '400px' }}></div>
            </Card>

            <Card className={styles.chartCard}>
              <div ref={userRankingChartRef} style={{ width: '100%', height: '400px' }}></div>
            </Card>
          </div>
        </div>
      </PageContainer>
  );
};

export default HomePage;
