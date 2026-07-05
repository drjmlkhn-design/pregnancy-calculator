const MS=86400000,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],D=window.PREGNANCY_DATA;let latestSummary = "";
let currentWeek = "";for(let i=21;i<=35;i++){const o=document.createElement("option");o.value=i;o.textContent=i+" days";if(i===28)o.selected=true;$("#cycleLength")?.append(o)}function pd(v){if(!v)return null;const[a,b,c]=v.split("-").map(Number);return new Date(a,b-1,c)}function idate(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}function add(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}function diff(a,b){return Math.round((new Date(b.getFullYear(),b.getMonth(),b.getDate())-new Date(a.getFullYear(),a.getMonth(),a.getDate()))/MS)}function fmt(d,long=false){return new Intl.DateTimeFormat(undefined,{weekday:long?"long":undefined,month:long?"long":"short",day:"numeric",year:"numeric"}).format(d)}function zodiac(d){return[[120,"Capricorn"],[219,"Aquarius"],[320,"Pisces"],[420,"Aries"],[521,"Taurus"],[621,"Gemini"],[722,"Cancer"],[823,"Leo"],[923,"Virgo"],[1023,"Libra"],[1122,"Scorpio"],[1222,"Sagittarius"],[1231,"Capricorn"]].find(x=>d.getMonth()*100+d.getDate()+101<=x[0])[1]}function chinese(y){return["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"][(y-2020+1200)%12]}function kg(x){return(x*.453592).toFixed(1)}function cm(x){return(x*2.54).toFixed(1)}function g(x){return Math.round(x*28.3495)}function metric(){return ["uk","india","australia","europe"].includes($("#region")?.value)}function dates(){const m=$("#method").value;if(m==="lmp"){const l=pd($("#lmpDate").value);if(!l)return null;return{lmp:l,due:add(l,280+(+$("#cycleLength").value-28)),source:"last menstrual period"}}if(m==="conception"){const c=pd($("#conceptionDate").value);if(!c)return null;return{lmp:add(c,-14),due:add(c,266),source:"estimated conception"}}if(m==="ultrasound"){const s=pd($("#scanDate").value),w=+$("#scanWeeks").value,d=+$("#scanDays").value;if(!s)return null;const l=add(s,-(w*7+d));return{lmp:l,due:add(l,280),source:"ultrasound dating"}}const t=pd($("#transferDate").value),e=+$("#embryoAge").value;if(!t)return null;return{lmp:add(t,-(14+e)),due:add(t,266-e),source:"IVF transfer"}}function tri(day){return day<98?["first","First trimester"]:day<196?["second","Second trimester"]:["third","Third trimester"]}function wr(){if($("#pregnancyType").value==="twins")return[37,54];return{under:[28,40],normal:[25,35],over:[15,25],obese:[11,20]}[$("#bmiCategory").value]}function testsFor(w){return D.tests.filter(([a,b])=>w>=a-1&&w<=b+1).map(([a,b,t])=>`Weeks ${a}-${b}: ${t}`)}function list(a){return"<ul class=list>"+a.map(x=>"<li>"+x+"</li>").join("")+"</ul>"}function report(){const x=dates();if(!x){$("#report").innerHTML="<div class=result-hero><p>Add a date to calculate your report.</p></div>";return}const now=new Date,day=diff(x.lmp,now),bounded=Math.max(0,day),week=Math.min(42,Math.max(1,Math.floor(bounded/7)+1));currentWeek=week;const cw=Math.floor(bounded/7),ed=bounded%7,rem=diff(now,x.due),[tk,tl]=tri(bounded),size=D.sizes[Math.min(41,week-1)],range=wr(),met=metric(),sizeText=met?`About ${cm(size[1])} cm and ${g(size[2])} g, roughly ${/^[aeiou]/i.test(size[0]) ? "an" : "a"} ${size[0]}.`:`About ${size[1]} in and ${size[2]} oz, roughly a ${size[0]}.`,weightText=met?`${kg(range[0])}-${kg(range[1])} kg`:`${range[0]}-${range[1]} lb`,risk=[];if($("#irregularCycle")?.checked)risk.push("Irregular cycles can make LMP dating less precise.");if($("#previousCsection")?.checked)risk.push("Previous C-section: discuss birth options with your clinician.");if($("#highRisk")?.checked)risk.push("High-risk care: follow your specialist's individualized plan.");if(+(($("#age")||{}).value||0)>=35)risk.push("Age 35+: ask about screening and monitoring options.");const weeklyTips = tk==="first"
  ? "Small frequent meals, rest, hydration, and prenatal vitamins may help during early pregnancy."
  : tk==="second"
    ? "This is often a good time to plan the anatomy scan, track questions for visits, and maintain gentle activity if cleared."
    : "Focus on movement patterns, birth preparation, feeding plans, and late-pregnancy appointments.";

const info = D.weekInfo?.[week - 1] || {};

latestSummary = [
  "🩷 𝗣𝗿𝗲𝗴𝗻𝗮𝗻𝗰𝘆 𝗗𝘂𝗲 𝗗𝗮𝘁𝗲 𝗥𝗲𝗽𝗼𝗿𝘁",
  "",
  `📅 𝗗𝘂𝗲 𝗱𝗮𝘁𝗲: ${fmt(x.due,true)}`,
  `❤️ 𝗘𝘀𝘁𝗶𝗺𝗮𝘁𝗲𝗱 𝗰𝗼𝗻𝗰𝗲𝗽𝘁𝗶𝗼𝗻: ${fmt(add(x.lmp,14))}`,
  `🤰 𝗚𝗲𝘀𝘁𝗮𝘁𝗶𝗼𝗻𝗮𝗹 𝗮𝗴𝗲: ${cw}w ${ed}d`,
  `📆 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝘄𝗲𝗲𝗸: Week ${week}`,
  `🌸 𝗧𝗿𝗶𝗺𝗲𝘀𝘁𝗲𝗿: ${tl}`,
  `⏳ 𝗗𝗮𝘆𝘀 𝗿𝗲𝗺𝗮𝗶𝗻𝗶𝗻𝗴: ${rem >= 0 ? rem + " days" : Math.abs(rem) + " days past due"}`,
  `♍ 𝗭𝗼𝗱𝗶𝗮𝗰: ${zodiac(x.due)}`,
  `🐎 𝗖𝗵𝗶𝗻𝗲𝘀𝗲 𝗭𝗼𝗱𝗶𝗮𝗰: ${chinese(x.due.getFullYear())}`,
  "",
  "👶 𝗙𝗲𝘁𝗮𝗹 𝗱𝗲𝘃𝗲𝗹𝗼𝗽𝗺𝗲𝗻𝘁",
  D.fetalNotes[week - 1],
  "",
  "🍈 𝗕𝗮𝗯𝘆 𝘀𝗶𝘇𝗲 𝗰𝗼𝗺𝗽𝗮𝗿𝗶𝘀𝗼𝗻",
  sizeText,
  "",
  "🤱 𝗖𝗼𝗺𝗺𝗼𝗻 𝘀𝘆𝗺𝗽𝘁𝗼𝗺𝘀",
  info.symptoms || "Symptoms can vary from pregnancy to pregnancy. Contact your care team for symptoms that feel severe, unusual, or concerning.",
  "",
  "🩺 𝗧𝗲𝘀𝘁𝘀 & 𝗮𝗽𝗽𝗼𝗶𝗻𝘁𝗺𝗲𝗻𝘁𝘀",
  testsFor(week).length ? testsFor(week).join("\n") : "No major routine screening window is highlighted this week; continue regular prenatal care.",
  "",
  "🥗 𝗡𝘂𝘁𝗿𝗶𝘁𝗶𝗼𝗻 𝗳𝗼𝗰𝘂𝘀",
  info.nutrition || "Focus on balanced meals, hydration, and prenatal vitamins if recommended by your clinician.",
  "",
  "💡 𝗣𝗲𝗿𝘀𝗼𝗻𝗮𝗹𝗶𝘇𝗲𝗱 𝘁𝗶𝗽𝘀",
  info.tips || weeklyTips,
  risk.length ? risk.join("\n") : "",
  "",
  "⚠️ 𝗪𝗮𝗿𝗻𝗶𝗻𝗴 𝘀𝗶𝗴𝗻𝘀",
  info.warnings || "Call your care team for heavy bleeding, severe pain, fever, fainting, severe headache, vision changes, fluid leakage, chest pain, shortness of breath, or decreased fetal movement later in pregnancy.",
  "",
  "🌐 𝗖𝗿𝗲𝗮𝘁𝗲 𝘆𝗼𝘂𝗿 𝗼𝘄𝗻 𝗽𝗲𝗿𝘀𝗼𝗻𝗮𝗹𝗶𝘇𝗲𝗱 𝗽𝗿𝗲𝗴𝗻𝗮𝗻𝗰𝘆 𝗿𝗲𝗽𝗼𝗿𝘁",
  "https://www.toolkitprohub.com/p/pregnancy-due-date-calculator.html",
  "",
  "⚕️ 𝗠𝗲𝗱𝗶𝗰𝗮𝗹 𝗱𝗶𝘀𝗰𝗹𝗮𝗶𝗺𝗲𝗿",
  "This report is provided for educational purposes only and should not replace advice, diagnosis, or treatment from your obstetrician, midwife, or other qualified healthcare professional."
].filter(Boolean).join("\n");$("#report").innerHTML=`<div class=result-hero><p class=eyebrow>Estimated due date</p><h2 class=date>${fmt(x.due)}</h2><p>${fmt(x.due,true)} · Based on ${x.source}</p></div><div class=stats><div class=stat><span>Gestational age</span><strong>${cw}w ${ed}d</strong></div><div class=stat><span>Current week</span><strong>Week ${week}</strong></div><div class=stat><span>Trimester</span><strong>${tl}</strong></div><div class=stat><span>Days remaining</span><strong>${rem>=0?rem+" days":Math.abs(rem)+" days past"}</strong></div></div><div class=progress-wrap><div class=progress-label><span>Pregnancy progress</span><span>${Math.round(Math.max(0,Math.min(100,day/280*100)))}%</span></div><div class=progress><div class=bar style="width:${Math.max(0,Math.min(100,day/280*100))}%"></div></div></div><div class=chart-wrap><div class=timeline><div>Week 4</div><div>Week 8</div><div>Week 12</div><div>Week 20</div><div>Week 40</div></div></div><div class=report-grid><article class=content-card><h2>Professional report</h2>${list(["Estimated conception: "+fmt(add(x.lmp,14)),"Zodiac: "+zodiac(x.due),"Chinese Zodiac: "+chinese(x.due.getFullYear()),"Baby size: "+sizeText,"Weight gain range: "+weightText])}</article><article class=content-card><h2>Weekly development</h2><p class=muted><strong>Week ${week}:</strong> ${D.fetalNotes[week-1]}</p><div class=pill-row><span class=pill>${size[0]}</span><span class=pill>${met?"Metric":"US"} units</span></div></article><article class=content-card><h2>Important prenatal tests</h2>${list(testsFor(week).length?testsFor(week):["No major routine screening window is highlighted this week; continue regular prenatal care."])}</article><article class=content-card><h2>Personalized tips</h2>${list((tk==="first"?["Take a prenatal vitamin with folic acid.","Ask before new medications or supplements.","Small frequent meals may help nausea."]:tk==="second"?["Plan the anatomy scan window.","Gentle movement may support energy and sleep if cleared.","Track questions for prenatal visits."]:["Learn normal movement patterns.","Prepare birth and feeding logistics.","Call promptly for concerning symptoms."]).concat(risk))}</article><article class="content-card wide"><h2>Pregnancy progress graph</h2><svg class=chart viewBox="0 0 600 180" role=img aria-label="Pregnancy growth graph"><polyline points="20,150 150,125 280,92 410,55 580,28" fill=none stroke=currentColor stroke-width=5 opacity=.35/><circle cx="${20+Math.min(560,week/42*560)}" cy="${150-Math.min(122,week/42*122)}" r=9 fill=currentColor /></svg></article>
<article class="content-card wide print-footer">
  <h2>Report notes</h2>

  <h3>Common symptoms</h3>
  <p>${info.symptoms || "Symptoms can vary from pregnancy to pregnancy."}</p>

  <h3>Nutrition focus</h3>
  <p>${info.nutrition || "Focus on balanced meals, hydration, and prenatal vitamins if recommended."}</p>

  <h3>Warning signs</h3>
  <p>${info.warnings || "Call your care team for heavy bleeding, severe pain, fever, fluid leakage, severe headache, vision changes, chest pain, shortness of breath, or decreased fetal movement later in pregnancy."}</p>

  <hr>

  <p>
    <strong>Create your own personalized pregnancy report:</strong><br>
    https://www.toolkitprohub.com/p/pregnancy-due-date-calculator.html
  </p>

  <p class="muted">
    <strong>Medical disclaimer:</strong>
    This report is provided for educational purposes only and should not replace advice,
    diagnosis, or treatment from your obstetrician, midwife, or other qualified healthcare professional.
  </p>
</article>
</div>`}function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}$$(".tab").forEach(t=>t.addEventListener("click",()=>{$("#method").value=t.dataset.method;$$(".tab").forEach(x=>x.setAttribute("aria-selected",x===t));$$(".method-pane").forEach(p=>p.classList.toggle("hidden",p.dataset.pane!==t.dataset.method))}));$("#themeButton")?.addEventListener("click",()=>{const n=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=n;$("#themeButton").textContent=n==="dark"?"☀":"☾"});$("#todayButton")?.addEventListener("click",()=>{const target={lmp:"#lmpDate",conception:"#conceptionDate",ultrasound:"#scanDate",ivf:"#transferDate"}[$("#method").value];$(target).value=idate(new Date);report()});document.querySelector(".calculator-panel")?.addEventListener("submit",e=>{e.preventDefault();report()});["region","pregnancyType","bmiCategory","cycleLength","irregularCycle","previousCsection","highRisk","age"].forEach(id=>$("#"+id)?.addEventListener("change",report));$("#printButton")?.addEventListener("click",()=>window.print());$("#shareButton")?.addEventListener("click",async()=>{if(!latestSummary)report();if(navigator.share)await navigator.share({title:"Pregnancy due date results",text:latestSummary});else if(navigator.clipboard){await navigator.clipboard.writeText(latestSummary);toast("Results copied for sharing.")}else toast("Sharing is unavailable.")});$("#emailButton")?.addEventListener("click", async () => {
  if (!latestSummary) report();
  

  const match = latestSummary.match(/Current week: Week (\d+)/);
  const currentWeek = match ? match[1] : "";

  const subject = encodeURIComponent(
    currentWeek
      ? `Your Pregnancy Due Date Report – Week ${currentWeek} | ToolkitProHub`
      : "Your Pregnancy Due Date Report | ToolkitProHub"
  );

  const body = encodeURIComponent(latestSummary);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

  window.open(gmailUrl, "_blank");

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(latestSummary);
    toast("Results copied. Gmail opened in a new tab.");
  }
});;$("#assistantButton")?.addEventListener("click",()=>{const q=$("#assistantInput").value.toLowerCase();let a="I can offer general education, but your clinician should guide medical decisions.";if(q.includes("pineapple"))a="Pineapple is commonly eaten during pregnancy as food. If you have diabetes, reflux, allergy, or a medical restriction, ask your clinician.";else if(q.includes("headache")||q.includes("bleeding")||q.includes("pain"))a="Please contact your care team promptly for severe headache, bleeding, significant pain, vision changes, fever, fluid leakage, or decreased fetal movement.";else if(q.includes("exercise"))a="Many uncomplicated pregnancies can include moderate activity, but restrictions depend on your medical history and symptoms.";$("#assistantAnswer").textContent=a});if($("#lmpDate")){$("#lmpDate").value=idate(add(new Date,-84));report()}
