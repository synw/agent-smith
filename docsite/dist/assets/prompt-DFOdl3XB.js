import{t as i}from"./state-AEKhF82p.js";import{P as s}from"./index-B7hGVm-Y.js";const o=`In Python I have a Pandas dataframe with this data (sample):

\`\`\`csv
{data}
\`\`\`

Please create a chart using Altair. Instructions for the code design:

- Always use Pandas to transform or resample the data if needed
- Leave the columns as is
- Use the Altair internal types
- Minimum chart width: 750 pixels
- Always return the chart object without printing it

Plot {prompt}
`;function p(){const t=new s(i.value);t.replaceSystem(`You are an AI programming assistant, specialized in data visualization in Python. You always output only one code block and only that. Do not explain
`),t.shots=[];const e=o.replace("{data}",`date,precipitation,temp_max,temp_min,wind,weather
2012-01-01,0.0,12.8,5.0,4.7,drizzle
2012-01-02,10.9,10.6,2.8,4.5,rain
2012-01-03,0.8,11.7,7.2,2.3,rain
2012-01-04,20.3,12.2,5.6,4.7,rain
2012-01-05,1.3,8.9,2.8,6.1,rain
2012-01-06,2.5,4.4,2.2,2.2,rain
2012-01-07,0.0,7.2,2.8,2.3,rain
2012-01-08,0.0,10.0,2.8,2.0,sun`).replace("{prompt}","precipitations by date"),a=" ```python\n";t.addShot(e,`import altair as alt
import pandas as pd

df = pd.read_csv('data.csv')

# Convert the date column to datetime
df['date'] = pd.to_datetime(df['date'])

# Create the Altair chart
chart = alt.Chart(df).mark_line().encode(
    x=alt.X('date:T', title='Date'),
    y=alt.Y('precipitation:Q', title='Precipitation'),
).properties(
    title='Precipitation by Date'
)

# Return the chart
chart
\`\`\``),t.afterShot=`

`,t.afterAssistant(a);const n=t.stop??new Array;return n.push("```\n"),t.stop=n,t}function d(t,e){const a=p(),r=a.prompt(o.replace("{prompt}",t).replace("{data}",e));return console.log("PROMPT:",r),{_prompt:r,tpl:a}}export{d as createChartPrompt};
