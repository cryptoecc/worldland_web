import styled from "styled-components"
import { BarChart, ResponsiveContainer, XAxis, Tooltip, Bar } from 'recharts';
import Card from 'components/Card'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { darken } from 'polished'
import useTheme from 'hooks/useTheme'
dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

const Wrapper = styled(Card)`
  width: 100%;
  height: ${DEFAULT_HEIGHT}px;
  padding: 1rem;
  padding-right: 2rem;
  margin: 1rem;
  display: flex;
  background-color: ${({ theme }) => theme.colors.bg0_08};
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

const CustomBar = ({
    x,
    y,
    width,
    height,
    fill,
}: {
    x: number
    y: number
    width: number
    height: number
    fill: string
}) => {
    return (
        <g>
            <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
        </g>
    )
}

const Chart = () => {
    const theme = useTheme()
    const data = [
        { name: 'Page A', uv: 50, },
        { name: 'Page B', uv: 60, },
        { name: 'Page C', uv: 40, },
        { name: 'Page D', uv: 20, },
        { name: 'Page E', uv: 10, },
        { name: 'Page C', uv: 1, },
        { name: 'Page D', uv: 12, },
        { name: 'Page E', uv: 75, },
        { name: 'Page C', uv: 280, },
        { name: 'Page D', uv: 230, },
        { name: 'Page E', uv: 330, },
        { name: 'Page E', uv: 330, },
        { name: 'Page E', uv: 330, },
        { name: 'Page E', uv: 330, },
        { name: 'Page E', uv: 330, },
        { name: 'Page C', uv: 280, },
        { name: 'Page D', uv: 230, },
        { name: 'Page E', uv: 330, },
        { name: 'Page C', uv: 280, },
        { name: 'Page D', uv: 230, },
        { name: 'Page A', uv: 200, },
        { name: 'Page B', uv: 240, },
        { name: 'Page C', uv: 280, },
        { name: 'Page D', uv: 230, },
    ];
    const color = "#dc4646";
    return (
        <Wrapper>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={darken(0.36, color)} stopOpacity={0.5} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="uv"
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(time) => dayjs().format('DD')}
                        minTickGap={10}
                    />
                    <Tooltip
                        cursor={{ stroke: theme?.bg2 }}
                    // contentStyle={{ display: 'none' }}
                    />
                    <Bar
                        dataKey="uv"
                        fill={color}
                        shape={(props: any) => {
                            return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={color} />
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Wrapper>
    )
}

export default Chart