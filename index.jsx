import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ============================================================
// 問題データ（各単元15問・全90問）
// 小5で習う漢字はすべて使用
// ============================================================
const UNITS = [
  {
    id:1, title:"天気と気象", emoji:"🌤️", color:"#29B6F6", bg:"#E1F5FE",
    topics:["雲と天気の変化","台風と気象情報","天気の変化のきまり"],
    quizzes:[
      {id:"1-01",emoji:"💨",q:"日本の天気が西から東へ変わるのはなぜか。",choices:["海流の影響","偏西風という西からの風が吹くから","太陽が東から昇るから","地球の自転方向と同じだから"],answer:1,hint:"偏西風は日本付近で常に西から東へ吹く大気の流れだよ。"},
      {id:"1-02",emoji:"🌀",q:"気象衛星の写真で、台風はどのように見えるか。",choices:["四角形の雲のかたまり","渦を巻いた雲","直線状に並んだ雲","小さな点"],answer:1,hint:"台風の目に向かって反時計回りに風が吹き込む渦状の雲が特徴だよ。"},
      {id:"1-03",emoji:"☁️",q:"雲ができる仕組みとして正しいのはどれか。",choices:["空気が温まり水蒸気が増える","空気が上昇して冷やされ水蒸気が水滴になる","海水が蒸発して直接雲になる","風が雲を作る"],answer:1,hint:"空気が上昇すると気圧が下がって冷え、水蒸気が細かい水滴になって雲ができるよ。"},
      {id:"1-04",emoji:"☀️",q:"天気記号で「晴れ」の記号はどれか。",choices:["●（黒丸）","○（白丸）","◎（二重丸）","△（三角）"],answer:1,hint:"晴れは白い○、快晴は◎、雨は●だよ。"},
      {id:"1-05",emoji:"🌊",q:"台風が最もよく発生する場所はどこか。",choices:["日本海","北極付近","熱帯の海上","南極付近"],answer:2,hint:"台風は温かい海（熱帯）の水蒸気をエネルギー源にして発生するよ。"},
      {id:"1-06",emoji:"🌧️",q:"雨量計では何を測るか。",choices:["雨粒の大きさ","一定時間に降った雨の量（深さ）","空気中の水蒸気量","雲の厚さ"],answer:1,hint:"雨量はmmで表し、1時間あたりの降水量で雨の強さを判断するよ。"},
      {id:"1-07",emoji:"🌦️",q:"春や秋に日本付近の天気が周期的に変わる理由は何か。",choices:["南高北低の気圧配置","西高東低の気圧配置","移動性高気圧と低気圧が交互に通る","停滞前線が長く続く"],answer:2,hint:"移動性高気圧と低気圧が交互にやってくることで天気が変わりやすくなるよ。"},
      {id:"1-08",emoji:"⛈️",q:"積乱雲（入道雲）が発達すると起こりやすい天気は何か。",choices:["おだやかな霧雨","強い雷雨やひょう","長時間の小雨","晴天が続く"],answer:1,hint:"積乱雲は垂直に大きく発達し、急激な大雨・雷・ひょうをもたらすよ。"},
      {id:"1-09",emoji:"🌈",q:"雨上がりに虹が見えるのはなぜか。",choices:["雲が光る","空気中の水滴が光を曲げて分ける","太陽が特別な色を出す","地面が光を反射する"],answer:1,hint:"水滴がプリズムのように光を屈折・反射させ、色ごとに分けるよ（分散）。"},
      {id:"1-10",emoji:"❄️",q:"冬に日本海側に雪が多く降る理由として正しいのはどれか。",choices:["日本海の水温が低いから","北西の季節風が日本海で水蒸気を含み山脈にぶつかるから","太平洋高気圧が強いから","偏西風が弱まるから"],answer:1,hint:"北西の季節風が日本海の水蒸気を含んで、山脈にぶつかって雪を降らせるよ。"},
      {id:"1-11",emoji:"🔭",q:"アメダスは何を観測する装置か。",choices:["宇宙の星","地震の揺れ","降水量・気温・風速などの気象要素","海底の地形"],answer:2,hint:"アメダス（AMeDAS）は全国の約1300か所に設置された自動気象観測装置だよ。"},
      {id:"1-12",emoji:"🌫️",q:"霧が発生するのはどのようなときか。",choices:["気温が急に上がるとき","地表付近の空気が冷やされて水蒸気が水滴になるとき","強い風が吹くとき","大雨が降った後"],answer:1,hint:"霧は地表付近で起きる小規模な雲と同じ仕組みで、水蒸気が冷やされてできるよ。"},
      {id:"1-13",emoji:"🌪️",q:"台風が日本に近づく際に特に注意が必要な現象として誤っているのはどれか。",choices:["強い風","大雨","高潮","低温・霜"],answer:3,hint:"台風は暖かい海で発達するので、低温・霜は台風の直接の被害ではないよ。"},
      {id:"1-14",emoji:"📡",q:"気象庁が発表する「警報」と「注意報」の違いとして正しいのはどれか。",choices:["警報の方が被害が軽い","注意報より警報の方が重大な危険が予想される","どちらも同じ意味","注意報は大雨のみに使う"],answer:1,hint:"警報は重大な被害のおそれ、注意報はやや軽い被害のおそれを意味するよ。"},
      {id:"1-15",emoji:"🌡️",q:"気温を正確に測るとき、温度計をどこに置くべきか。",choices:["直射日光が当たる場所","風通しのよい日かげ（百葉箱など）","地面の上","水の中"],answer:1,hint:"温度計は日かげで風通しのよい場所に置き、地面から1.2〜1.5mの高さで測るよ（百葉箱）。"},
    ]
  },
  {
    id:2, title:"植物の発芽と成長", emoji:"🌱", color:"#66BB6A", bg:"#E8F5E9",
    topics:["種子の発芽の条件","植物の成長に必要なもの","でんぷんと養分"],
    quizzes:[
      {id:"2-01",emoji:"🌰",q:"種子が発芽するために必要な3つの条件は何か。",choices:["水・日光・土","水・適切な温度・空気","日光・肥料・水","空気・肥料・温度"],answer:1,hint:"発芽に日光と肥料はいらないよ！水・適切な温度・空気の3つが必要だよ。"},
      {id:"2-02",emoji:"🔬",q:"ヨウ素液をかけると青紫色に変わる物質は何か。",choices:["たんぱく質","でんぷん","脂肪","食塩"],answer:1,hint:"ヨウ素液はでんぷんと反応して青紫色になるよ。種子のでんぷんを確かめる実験に使うよ。"},
      {id:"2-03",emoji:"🌿",q:"植物が光合成で作るものは何か。",choices:["水と酸素","でんぷんと酸素","二酸化炭素と水","窒素と水"],answer:1,hint:"光合成では光のエネルギーで水と二酸化炭素からでんぷんと酸素を作るよ。"},
      {id:"2-04",emoji:"🌑",q:"日光が当たらないと植物の成長はどうなるか。",choices:["速く成長する","茎は伸びるが弱々しく黄色っぽくなる","まったく成長しない","葉が大きくなる"],answer:1,hint:"光なしでも少し伸びるが、光合成できないので養分が作れず弱くなるよ（黄化現象）。"},
      {id:"2-05",emoji:"🌾",q:"肥料（窒素・リン酸・カリウム）のうち、葉や茎の成長に特に関係するのはどれか。",choices:["リン酸","カリウム","窒素","カルシウム"],answer:2,hint:"窒素はたんぱく質の材料で葉や茎をよく育てるよ。「葉肥（はごえ）」ともいうよ。"},
      {id:"2-06",emoji:"🫘",q:"インゲンマメの種子で、発芽するときの養分のたくわえ場所はどこか。",choices:["種皮（外側の皮）","胚乳","子葉","根の先"],answer:2,hint:"インゲンマメは子葉に養分をたくわえているよ。発芽のときのエネルギー源になるよ。"},
      {id:"2-07",emoji:"🧪",q:"「水がある・ない」を比べる発芽実験で、他の条件をどうすればよいか。",choices:["全部変える","水以外はすべて同じ条件にする","温度だけ変える","すべて自由でよい"],answer:1,hint:"1つの条件だけ変えて（対照実験）、他は同じにしないと正しい結論が出ないよ。"},
      {id:"2-08",emoji:"💧",q:"植物が水を取り込むのはどこからか。",choices:["葉の表面からすべて","根から吸収する","茎の中で作られる","空気中からすべて"],answer:1,hint:"根が水と水に溶けた肥料（無機養分）を吸収するよ。葉の気孔からも少し取り込むよ。"},
      {id:"2-09",emoji:"🌬️",q:"植物が気孔から行うことは何か。",choices:["根から栄養を吸う","水蒸気の蒸散と気体（酸素・二酸化炭素）の出し入れ","光合成だけ","土から栄養を運ぶ"],answer:1,hint:"気孔は葉の裏側に多くあり、蒸散や気体の交換を行う小さな穴だよ。"},
      {id:"2-10",emoji:"🌻",q:"植物の茎の中を水が通る管を何というか。",choices:["師管（しかん）","道管（どうかん）","気孔","根毛"],answer:1,hint:"道管は根から吸った水を葉まで運ぶ管だよ。師管は葉で作った養分を運ぶよ。"},
      {id:"2-11",emoji:"🌡️",q:"種子の発芽に適した温度について正しいのはどれか。",choices:["温度は関係ない","低すぎても高すぎても発芽しにくく、適切な温度が必要","高ければ高いほど早く発芽する","0℃でも発芽する"],answer:1,hint:"発芽に適した温度は植物の種類によって違うが、適切な範囲があるよ。"},
      {id:"2-12",emoji:"📏",q:"植物が成長するためにひつようなものをすべて選んだのはどれか。",choices:["水だけ","日光・水・空気（二酸化炭素）","肥料だけあれば十分","土がなければ育たない"],answer:1,hint:"植物が大きく育つには光合成のための日光・水・空気が必要だよ。肥料も助けになるよ。"},
      {id:"2-13",emoji:"🔍",q:"インゲンマメの発芽後、子葉はどうなるか。",choices:["ずっと大きくなり続ける","養分を使い切ってしぼんでいく","地中に残ったまま","落ちてまた発芽する"],answer:1,hint:"子葉にたくわえていた養分が使われると、子葉はしぼんで落ちるよ。"},
      {id:"2-14",emoji:"☀️",q:"光合成が行われる植物の部分はどこか。",choices:["根","茎","葉（葉緑体がある部分）","花"],answer:2,hint:"葉の細胞にある葉緑体（クロロフィル）が光を吸収して光合成を行うよ。"},
      {id:"2-15",emoji:"🌲",q:"植物が成長するとき、根・茎・葉のうち最も先にのびるのはどれか（一般的に）。",choices:["茎","葉","根","すべて同時"],answer:2,hint:"発芽のとき、まず根がのびて水や養分を吸えるようになってから茎・葉が育つよ。"},
    ]
  },
  {
    id:3, title:"メダカのたんじょう", emoji:"🐟", color:"#FF8A65", bg:"#FBE9E7",
    topics:["メダカのオスとメスの違い","受精と卵の発生","胚の観察"],
    quizzes:[
      {id:"3-01",emoji:"🐠",q:"メダカのオスとメスの見分け方で正しいのはどれか。",choices:["オスは体が大きい","オスは背びれに切れ込みがあり、しりびれが平行四辺形","メスの色が鮮やか","メスの背びれが大きい"],answer:1,hint:"背びれの切れ込みとしりびれの形でオスとメスを区別するよ。"},
      {id:"3-02",emoji:"🥚",q:"受精とは何か。",choices:["卵が水に触れること","精子と卵が合体すること","卵が孵化すること","親が卵を産むこと"],answer:1,hint:"精子が卵に入り込んで合体することを受精というよ。受精した卵を受精卵というよ。"},
      {id:"3-03",emoji:"🔭",q:"メダカの卵を観察するのに最も適した道具はどれか。",choices:["虫眼鏡だけ","双眼実体顕微鏡（解剖顕微鏡）","電子顕微鏡","天体望遠鏡"],answer:1,hint:"卵は立体的なので、立体的に拡大できる双眼実体顕微鏡が適しているよ。"},
      {id:"3-04",emoji:"🌡️",q:"メダカの受精卵が育つのに適した水温はどれか。",choices:["5〜10℃","20〜25℃","35〜40℃","0℃以下"],answer:1,hint:"人が過ごしやすい温度と同じくらい（20〜25℃）が最適だよ。"},
      {id:"3-05",emoji:"❤️",q:"受精後、卵の中で最初に確認できる変化は何か。",choices:["うろこができる","心臓の動き（拍動）","えらが見える","ひれが動く"],answer:1,hint:"受精後2日ほどで心臓が動き始めるのが観察できるよ。命の誕生を感じる瞬間だね！"},
      {id:"3-06",emoji:"🌿",q:"メダカの卵の外側についている糸のような突起の役割は何か。",choices:["栄養を取り込む","水草などに付着するため","敵から守るため","呼吸するため"],answer:1,hint:"卵の表面の細い糸（付着糸）は水草などにくっつくための構造で、流されないようにするためだよ。"},
      {id:"3-07",emoji:"📅",q:"25℃の水温でメダカの受精卵が孵化するまで約何日かかるか。",choices:["1〜2日","10〜14日","30日以上","3〜4日"],answer:1,hint:"約2週間かけて少しずつ体ができていくよ。温度が低いともっと時間がかかるよ。"},
      {id:"3-08",emoji:"🍳",q:"孵化したばかりのメダカの赤ちゃんのお腹が大きい理由は何か。",choices:["食べ過ぎたから","卵黄（栄養のかたまり）が残っているから","病気だから","水を飲んだから"],answer:1,hint:"卵の中にあった卵黄（栄養袋）を体内に抱えたまま孵化するよ。しばらくはこれで生きるよ。"},
      {id:"3-09",emoji:"🐟",q:"メダカのメスの特徴として正しいのはどれか。",choices:["しりびれが平行四辺形","背びれに深い切れ込みがある","しりびれが三角形に近い","体の色が黒い"],answer:2,hint:"メスのしりびれは三角形に近い形だよ。オスの平行四辺形と見比べてみよう！"},
      {id:"3-10",emoji:"🌊",q:"メダカの卵は何日ごろから目が見えるようになるか（25℃）。",choices:["受精直後","受精後4〜5日ごろ","受精後20日ごろ","孵化した後"],answer:1,hint:"受精後4〜5日ごろには大きな目が見えるようになるよ。顕微鏡で確認できるよ！"},
      {id:"3-11",emoji:"🧬",q:"受精卵が細胞分裂を繰り返してやがて1匹の生き物になる過程を何というか。",choices:["光合成","発生","消化","分解"],answer:1,hint:"受精卵が分裂・成長して体の形が作られていく過程を「発生」というよ。"},
      {id:"3-12",emoji:"💧",q:"メダカを育てるとき、水道水をそのまま使わない理由は何か。",choices:["水道水は冷たすぎるから","水道水に含まれる塩素（カルキ）がメダカに有害だから","水道水には栄養がないから","水道水は重すぎるから"],answer:1,hint:"水道水の塩素（カルキ）はメダカに有害なので、くみ置きして塩素を抜くか中和剤を使うよ。"},
      {id:"3-13",emoji:"🔬",q:"顕微鏡の倍率を上げると視野（見える範囲）はどうなるか。",choices:["広くなる","狭くなる","変わらない","明るくなる"],answer:1,hint:"倍率が上がると細かく見えるが、見える範囲（視野）は狭くなり、暗くなるよ。"},
      {id:"3-14",emoji:"🐣",q:"孵化したてのメダカの稚魚はどのように泳ぐか。",choices:["活発に泳ぎ回る","しばらくじっとして動かない、または底にいる","すぐに底砂に潜る","水面だけを泳ぐ"],answer:1,hint:"孵化直後は卵黄を使い切るまであまり動かず、安全な場所でじっとしていることが多いよ。"},
      {id:"3-15",emoji:"🌸",q:"メダカが産卵するのはいつごろか（自然の環境で）。",choices:["冬","春から夏（水温が上がり日照時間が長くなるころ）","秋","一年中同じ"],answer:1,hint:"メダカは水温が上がり（15℃以上）、日照時間が長くなる春〜夏に産卵するよ。"},
    ]
  },
  {
    id:4, title:"流れる水のはたらき", emoji:"💧", color:"#42A5F5", bg:"#E3F2FD",
    topics:["侵食・運搬・堆積","川の上流と下流の違い","洪水と土砂災害"],
    quizzes:[
      {id:"4-01",emoji:"⛏️",q:"川が地面を削るはたらきを何というか。",choices:["堆積","運搬","侵食","蒸発"],answer:2,hint:"侵食（しんしょく）は川の水が岩や土を削り取るはたらきだよ。"},
      {id:"4-02",emoji:"🚛",q:"川が土や砂を流し運ぶはたらきを何というか。",choices:["侵食","堆積","蒸発","運搬"],answer:3,hint:"削り取った土や砂を下流へ運ぶはたらきが「運搬（うんぱん）」だよ。"},
      {id:"4-03",emoji:"🏖️",q:"川の流れが遅くなった所で起きることは何か。",choices:["侵食が進む","石が溶ける","運んできた土や砂が積もる（堆積）","水が蒸発する"],answer:2,hint:"流れが遅くなると水が運べなくなり、土や砂・れきが沈んで積もるよ。これが堆積だよ。"},
      {id:"4-04",emoji:"🪨",q:"川の上流にある石の特徴として正しいのはどれか。",choices:["小さくて丸い","大きくて角ばっている","小さくて軽い","とても平べったい"],answer:1,hint:"上流は流れが速く、大きな岩が砕かれたばかりで角ばっているよ。"},
      {id:"4-05",emoji:"↪️",q:"川の曲がった部分で流れが速いのはどちらか。",choices:["曲がりの内側","曲がりの外側","どちらも同じ","川の真ん中"],answer:1,hint:"外側は遠回りする分だけ速く、侵食が進んで崖になりやすいよ。内側は砂が堆積するよ。"},
      {id:"4-06",emoji:"🌊",q:"大雨の後に川の水量が増えると起きやすいことは何か。",choices:["川がきれいになる","魚が増える","洪水・氾濫が起きやすくなる","水が凍る"],answer:2,hint:"大雨で水量が急増すると川が溢れる（洪水・氾濫）危険があるよ。"},
      {id:"4-07",emoji:"📝",q:"川の流れの3つのはたらきをすべて正しく並べたのはどれか。",choices:["蒸発・循環・堆積","侵食・運搬・堆積","侵食・蒸発・循環","堆積・吸収・分解"],answer:1,hint:"川の水のはたらきは「侵食（削る）・運搬（運ぶ）・堆積（積もる）」の3つだよ。"},
      {id:"4-08",emoji:"🏝️",q:"川の下流の石の特徴は何か。",choices:["大きくて角ばっている","小さくて丸い","真っ白でなめらか","ガラスのように透明"],answer:1,hint:"石は長い距離を運ばれながら互いにぶつかり合って、だんだん小さく丸くなるよ。"},
      {id:"4-09",emoji:"🏔️",q:"川の上流の地形の特徴として正しいのはどれか。",choices:["平らで広い","V字形の深い谷が多い","砂浜が広がる","三角州ができる"],answer:1,hint:"上流は流れが速く侵食が強いため、V字形の深い谷（V字谷）ができるよ。"},
      {id:"4-10",emoji:"🌍",q:"川が海や湖に流れ込むところにできる地形を何というか。",choices:["扇状地","三角州（デルタ）","V字谷","段丘"],answer:1,hint:"川が海に流れ込むところで流れが遅くなり、土砂が積もって三角形の地形（三角州）ができるよ。"},
      {id:"4-11",emoji:"💦",q:"川の流れの速さについて正しいのはどれか。",choices:["上流より下流の方が速い","下流より上流の方が速い","どこも同じ","川幅が広いほど速い"],answer:1,hint:"上流は川の傾きが急なので流れが速く、下流は緩やかなので遅くなるよ。"},
      {id:"4-12",emoji:"🗺️",q:"ハザードマップとは何か。",choices:["宝の地図","自然災害の被害が起こる可能性のある場所を示した地図","川の深さを示す地図","気温の変化を示す地図"],answer:1,hint:"ハザードマップは洪水・土砂崩れなどの危険な場所を前もって示した防災地図だよ。"},
      {id:"4-13",emoji:"🌧️",q:"土砂災害が起きやすい条件として正しいのはどれか。",choices:["晴れの日が続くとき","大雨や長雨が続いたとき","気温が下がるとき","風が強いとき"],answer:1,hint:"大雨や長雨で山の土が水を含み過ぎると、崩れやすくなるよ（土砂崩れ・がけ崩れ）。"},
      {id:"4-14",emoji:"🏞️",q:"川の中流でよく見られる地形として正しいのはどれか。",choices:["急な滝と大きな岩","扇状地（せんじょうち）","広い平野と三角州","氷河"],answer:1,hint:"上流から運ばれた砂や小石が山から平野に出たところに積もって扇状地ができるよ。"},
      {id:"4-15",emoji:"🔄",q:"川の水は最終的にどこへ行くか。",choices:["地下に全部しみ込む","海や湖に流れ込み、蒸発して水蒸気になり雨として戻る","消えてなくなる","空気になる"],answer:1,hint:"川の水は海へ流れ込み、蒸発して雲になり、また雨として降るよ。これが水の循環だよ。"},
    ]
  },
  {
    id:5, title:"ものの溶け方", emoji:"🧪", color:"#AB47BC", bg:"#F3E5F5",
    topics:["溶解と飽和","水溶液の性質","溶けたものを取り出す方法"],
    quizzes:[
      {id:"5-01",emoji:"🧂",q:"食塩が水に溶けた液のように、ものが水に溶けた液体を何というか。",choices:["混合液","懸濁液","水溶液","飽和液"],answer:2,hint:"ものが水に溶けてできた均一な液体を「水溶液（すいようえき）」というよ。"},
      {id:"5-02",emoji:"🔍",q:"水溶液の中で、溶けたものはどこにあるか。",choices:["底に沈んでいる","上の方に集まっている","全体に均一に広がっている","固まりになっている"],answer:2,hint:"水溶液は透明で、溶けたものが全体に均一に広がっているのが特徴だよ。"},
      {id:"5-03",emoji:"🥄",q:"一定量の水にものを溶かせる量には限りがある。限界まで溶けた状態を何というか。",choices:["溶解","飽和（ほうわ）","凝固","蒸発"],answer:1,hint:"これ以上溶けない状態が「飽和」だよ。飽和した水溶液を「飽和水溶液」というよ。"},
      {id:"5-04",emoji:"🌡️",q:"水温を上げると溶ける量が大きく増えるのはどれか。",choices:["食塩","ミョウバン","砂糖","すべて同じ"],answer:1,hint:"ミョウバンは温度が上がると溶ける量がぐんと増えるよ。食塩はほとんど変わらないよ。"},
      {id:"5-05",emoji:"🔥",q:"食塩水から食塩を取り出す最もよい方法はどれか。",choices:["冷やす","ろ過する","水を蒸発させる","磁石を使う"],answer:2,hint:"食塩は温度変化で溶ける量がほとんど変わらないので、水を蒸発させるのが一番だよ。"},
      {id:"5-06",emoji:"❄️",q:"ミョウバン水溶液からミョウバンを取り出す最も効率的な方法はどれか。",choices:["水を蒸発させる","冷やす（冷却再結晶）","ろ過する","温める"],answer:1,hint:"ミョウバンは温度が下がると一気に溶けにくくなるので、冷やすと結晶が出てくるよ。"},
      {id:"5-07",emoji:"⚖️",q:"水50mLに食塩10gを溶かしたとき、水溶液の重さはどうなるか。",choices:["50gのまま","60gになる","50gより少なくなる","100gになる"],answer:1,hint:"ものが溶けても重さは消えないよ！水の重さ＋食塩の重さ＝水溶液の重さになるよ（質量保存）。"},
      {id:"5-08",emoji:"🫙",q:"ろ過でできることはどれか。",choices:["水に溶けたものを取り出す","水に溶けていない固体を液体から分ける","蒸発させる","温度を下げる"],answer:1,hint:"ろ過は水に溶けていない固体（泥など）を取り除く方法だよ。食塩はろ過できないよ。"},
      {id:"5-09",emoji:"🌊",q:"「溶解度」とは何か。",choices:["溶けるまでの時間","100gの水に溶ける物質の最大量（g）","水の量","溶液の濃さ"],answer:1,hint:"溶解度は水100gにその物質が最大何g溶けるかを示す数値だよ。温度によって変わるよ。"},
      {id:"5-10",emoji:"🔭",q:"水溶液を蒸発皿に取って加熱すると何が残るか（食塩水の場合）。",choices:["何も残らない","食塩の固体が残る","水だけ残る","気体が残る"],answer:1,hint:"水が蒸発して飛んでいくと、溶けていた食塩が固体として残るよ。"},
      {id:"5-11",emoji:"🥤",q:"水溶液を作るとき、かき混ぜると早く溶けるのはなぜか。",choices:["温度が上がるから","溶けたものが広がり未溶解物の周りに新しい水が来やすくなるから","圧力が上がるから","光が当たるから"],answer:1,hint:"かき混ぜると溶けたものが広がり、溶けていない粒の周りに新しい水が来て溶けやすくなるよ。"},
      {id:"5-12",emoji:"📊",q:"食塩とミョウバンを比べたとき、温度変化による溶解度の変化が大きいのはどちらか。",choices:["食塩","ミョウバン","どちらも同じ","水温では変わらない"],answer:1,hint:"ミョウバンは水温が上がると溶解度が大きく変化するよ。食塩はほぼ変わらないよ。"},
      {id:"5-13",emoji:"🧬",q:"水溶液の濃さ（濃度）を求める式として正しいのはどれか。",choices:["溶けたものの重さ÷水の重さ×100","溶けたものの重さ÷水溶液の重さ×100","水の重さ÷溶けたものの重さ×100","水溶液の体積÷溶けたものの重さ"],answer:1,hint:"濃度（%）＝溶けたものの重さ÷水溶液全体の重さ×100 だよ。分母は水溶液全体だよ！"},
      {id:"5-14",emoji:"💎",q:"溶けていたものを再び結晶として取り出すことを何というか。",choices:["蒸発","再結晶","凝固","析出"],answer:1,hint:"冷やしたり蒸発させたりして溶けていたものを結晶として取り出すことを「再結晶」というよ。"},
      {id:"5-15",emoji:"🌈",q:"水溶液の性質として正しいのはどれか。",choices:["必ず色がある","透明で均一（どの部分も同じ濃さ）","時間が経つと沈殿する","かき混ぜると分離する"],answer:1,hint:"水溶液は透明（無色または有色）で、どこも同じ濃さ（均一）なのが特徴だよ。"},
    ]
  },
  {
    id:6, title:"電磁石のはたらき", emoji:"🧲", color:"#EF5350", bg:"#FFEBEE",
    topics:["電磁石の性質","電磁石の強さの変え方","電流と磁力"],
    quizzes:[
      {id:"6-01",emoji:"⚡",q:"電磁石の説明として正しいのはどれか。",choices:["常に磁力がある","電流が流れているときだけ磁力を持つ","鉄でできた磁石","光が当たると磁力が生まれる"],answer:1,hint:"電磁石は電流のON/OFFで磁力をコントロールできるのが永久磁石との大きな違いだよ。"},
      {id:"6-02",emoji:"🔋",q:"電磁石を強くする方法として正しいのはどれか。",choices:["コイルの巻き数を減らす","電流を弱くする","乾電池の数を増やして電流を強くする","鉄の棒を木の棒に換える"],answer:2,hint:"電磁石は①コイルの巻き数を増やす②電流を強くする の2つの方法で強くなるよ。"},
      {id:"6-03",emoji:"🔄",q:"電磁石のN極とS極を逆にするにはどうすればよいか。",choices:["乾電池を増やす","コイルの巻き数を増やす","電流の向きを逆にする","鉄の棒を抜く"],answer:2,hint:"電流の向きが変わると磁界の方向が変わり、N極とS極が入れ替わるよ。"},
      {id:"6-04",emoji:"🔩",q:"コイルに電流を流したとき、中に鉄の棒を入れると磁力はどうなるか。",choices:["弱くなる","変わらない","強くなる","なくなる"],answer:2,hint:"コイルの中に鉄の棒（鉄心）を入れると、鉄心が磁化されて磁力が大幅にアップするよ。"},
      {id:"6-05",emoji:"🏭",q:"電磁石と永久磁石（ふつうの磁石）の最大の違いは何か。",choices:["電磁石は鉄を引きつけない","電磁石は電流で磁力のON/OFFや強さを変えられる","永久磁石の方が必ず強い","どちらも同じ"],answer:1,hint:"電磁石の最大の利点は磁力の強さや向きをコントロールできること！クレーンやモーターに使われるよ。"},
      {id:"6-06",emoji:"🧭",q:"方位磁針を電磁石の近くに置くとどうなるか。",choices:["反応しない","電磁石のN・S極に引き寄せられて針が向きを変える","溶けてしまう","吸い寄せられてくっつく"],answer:1,hint:"電磁石も磁力があるので方位磁針の針に影響を与えるよ。磁界の向きを確認できるね。"},
      {id:"6-07",emoji:"⚙️",q:"電磁石を使ったものとして正しいのはどれか。",choices:["ガスコンロ","電灯（白熱電球）","モーター（電動機）","水道のじゃ口"],answer:2,hint:"モーターは電磁石と永久磁石の引き合い・反発を使って回転するよ。扇風機・電車に使われるよ。"},
      {id:"6-08",emoji:"📊",q:"コイルの巻き数を50回から100回に増やすと磁力はどうなるか（電流は同じ）。",choices:["変わらない","弱くなる","強くなる","なくなる"],answer:2,hint:"コイルの巻き数を増やすと磁力は強くなるよ。巻き数が2倍になれば約2倍の磁力になるよ。"},
      {id:"6-09",emoji:"🔌",q:"乾電池2個を直列につなぐと電流はどうなるか。",choices:["変わらない","電流が弱くなる","電流が強くなる","電流が流れなくなる"],answer:2,hint:"直列につなぐと電圧が2倍になって電流が強くなるよ。電磁石も強くなるよ。"},
      {id:"6-10",emoji:"🎯",q:"電磁石の鉄心に使う材料として最も適しているのはどれか。",choices:["アルミニウム棒","銅棒","鉄棒","プラスチック棒"],answer:2,hint:"鉄は磁化されやすく、電流を切ると磁力が弱まるので、電磁石の鉄心に最適だよ。"},
      {id:"6-11",emoji:"🚂",q:"リニアモーターカーが浮いて走る仕組みに関係するのは何か。",choices:["空気の力","電磁石の反発・引き合い","車輪の回転","燃料の燃焼"],answer:1,hint:"リニアモーターカーは電磁石の反発力で浮き上がり、引き合いで前進するよ。"},
      {id:"6-12",emoji:"🎵",q:"スピーカーに電磁石が使われているのはなぜか。",choices:["音を吸収するため","電流の変化で磁力が変わり、振動板を動かして音を出すため","電気を発生させるため","温めるため"],answer:1,hint:"スピーカーは電磁石の磁力の変化で振動板を動かし、空気を振動させて音を出すよ。"},
      {id:"6-13",emoji:"🏗️",q:"工場でくず鉄を持ち上げるクレーンに電磁石が使われる最大の理由は何か。",choices:["軽いから","電流を切るだけで鉄を落とせるから","安いから","錆びないから"],answer:1,hint:"電磁石は電流を切るだけで磁力が消えるので、鉄くずを持ち上げてから電流を切って落とせるよ。"},
      {id:"6-14",emoji:"🔋",q:"電磁石の実験で導線を巻くとき、同じ方向に巻かないといけない理由は何か。",choices:["見た目をよくするため","逆向きに巻くと磁力が打ち消し合うから","材料を節約するため","電流が流れやすくなるから"],answer:1,hint:"逆向きに巻くと互いの磁力が打ち消し合って弱くなってしまうよ。同じ方向に巻くのが大事だよ。"},
      {id:"6-15",emoji:"💡",q:"電磁石を使ったおもちゃや道具として正しくないのはどれか。",choices:["電動歯ブラシ","電車のモーター","乾電池（電池そのもの）","電磁ブレーキ"],answer:2,hint:"乾電池は電気を発生させる道具で、電磁石を使ったものではないよ。電磁石は電気を使うもの。"},
    ]
  }
];

const BADGES = [
  {id:"first_quiz",label:"はじめの一歩",emoji:"🚀",desc:"最初のクイズに挑戦！"},
  {id:"perfect",label:"パーフェクト",emoji:"⭐",desc:"1単元を全問正解！"},
  {id:"all_units",label:"理科マスター",emoji:"🏆",desc:"全6単元をクリア！"},
  {id:"streak3",label:"3連続正解",emoji:"🔥",desc:"3問連続で正解！"},
  {id:"fast_answer",label:"スピードスター",emoji:"⚡",desc:"5秒以内に正解！"},
  {id:"retry_clear",label:"あきらめない心",emoji:"💪",desc:"まちがい直しで全問正解！"},
];

function useSound(){
  const ctx=useRef(null);
  const getCtx=()=>{if(!ctx.current)ctx.current=new(window.AudioContext||window.webkitAudioContext)();return ctx.current;};
  const play=(fn)=>{try{fn(getCtx());}catch(e){}};
  return{
    correct:()=>play(ac=>{[[523,0],[659,0.12],[784,0.24],[1047,0.36]].forEach(([f,t])=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(0,ac.currentTime+t);g.gain.linearRampToValueAtTime(0.18,ac.currentTime+t+0.04);g.gain.linearRampToValueAtTime(0,ac.currentTime+t+0.18);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.2);});}),
    wrong:()=>play(ac=>{[[300,0],[220,0.15]].forEach(([f,t])=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=f;o.type="sawtooth";g.gain.setValueAtTime(0,ac.currentTime+t);g.gain.linearRampToValueAtTime(0.12,ac.currentTime+t+0.03);g.gain.linearRampToValueAtTime(0,ac.currentTime+t+0.2);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.25);});}),
    clear:()=>play(ac=>{[[523,0],[659,0.1],[784,0.2],[1047,0.32],[1319,0.46]].forEach(([f,t])=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=f;o.type="triangle";g.gain.setValueAtTime(0,ac.currentTime+t);g.gain.linearRampToValueAtTime(0.2,ac.currentTime+t+0.05);g.gain.linearRampToValueAtTime(0,ac.currentTime+t+0.35);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.4);});}),
    badge:()=>play(ac=>{[1047,1319,1568,2093].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=f;o.type="sine";const t=i*0.08;g.gain.setValueAtTime(0,ac.currentTime+t);g.gain.linearRampToValueAtTime(0.15,ac.currentTime+t+0.04);g.gain.linearRampToValueAtTime(0,ac.currentTime+t+0.22);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.25);});}),
    tap:()=>play(ac=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=800;o.type="sine";g.gain.setValueAtTime(0.08,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.06);o.start(ac.currentTime);o.stop(ac.currentTime+0.07);}),
    streak:()=>play(ac=>{[880,1100,1320].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=f;o.type="sine";const t=i*0.07;g.gain.setValueAtTime(0,ac.currentTime+t);g.gain.linearRampToValueAtTime(0.13,ac.currentTime+t+0.03);g.gain.linearRampToValueAtTime(0,ac.currentTime+t+0.15);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.18);});}),
  };
}

function shuffleChoices(quiz){const indexed=quiz.choices.map((c,i)=>({text:c,isAnswer:i===quiz.answer}));for(let i=indexed.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[indexed[i],indexed[j]]=[indexed[j],indexed[i]];}return{...quiz,choices:indexed.map(c=>c.text),answer:indexed.findIndex(c=>c.isAnswer)};}
function todayStr(){return new Date().toLocaleDateString("ja-JP",{month:"2-digit",day:"2-digit"});}

function Stars({count}){return <span>{[...Array(3)].map((_,i)=><span key={i} style={{fontSize:18,color:i<count?"#FFD700":"#ddd"}}>★</span>)}</span>;}
function Confetti({active}){
  const colors=["#FF6B6B","#4ECDC4","#FFE66D","#A8E6CF","#FF8B94","#B4F8C8"];
  if(!active) return null;
  return(<div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}}>{[...Array(40)].map((_,i)=>(<div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:"-20px",width:`${Math.random()*10+6}px`,height:`${Math.random()*10+6}px`,background:colors[i%colors.length],borderRadius:Math.random()>0.5?"50%":"0",animation:`confettiFall ${Math.random()*2+1.5}s ease-in ${Math.random()*0.5}s forwards`,transform:`rotate(${Math.random()*360}deg)`}}/>))}</div>);
}

const LS_KEY="rika5_v2";
function loadState(){try{const raw=localStorage.getItem(LS_KEY);if(!raw)return null;return JSON.parse(raw);}catch{return null;}}
function saveState(state){try{localStorage.setItem(LS_KEY,JSON.stringify(state));}catch{}}
function calcUnitProgress(unit,correctIds){const total=unit.quizzes.length;const done=unit.quizzes.filter(q=>correctIds.has(q.id)).length;return{done,total,pct:total>0?Math.round((done/total)*100):0};}

function HomeScreen({correctIdsMap,wrongQuizIds,onStart,onStartRetry}){
  const totalQ=UNITS.reduce((a,u)=>a+u.quizzes.length,0);
  const allCorrect=useMemo(()=>{let n=0;UNITS.forEach(unit=>{const cids=correctIdsMap[unit.id]||new Set();n+=unit.quizzes.filter(q=>cids.has(q.id)).length;});return n;},[correctIdsMap]);
  const pct=Math.round((allCorrect/totalQ)*100);
  return(
    <div style={{padding:"0 0 80px"}}>
      <div style={{background:"linear-gradient(135deg,#FF8C00 0%,#E65100 100%)",borderRadius:"0 0 24px 24px",padding:"16px 20px 14px",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <div style={{fontSize:28}}>🔬</div>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:"-0.5px"}}>理科5年生</div>
          <div style={{fontSize:10,opacity:0.85}}>東京書籍 準拠 ・ 全{totalQ}問</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:22,fontWeight:900,lineHeight:1}}>{pct}<span style={{fontSize:12}}>%</span></div>
          <div style={{fontSize:10,opacity:0.8}}>達成率</div>
          <div style={{height:5,background:"rgba(255,255,255,0.3)",borderRadius:9,marginTop:4,width:72}}>
            <div style={{height:5,background:"#FFD700",borderRadius:9,width:`${pct}%`,transition:"width 0.8s",boxShadow:pct>0?"0 0 6px rgba(255,215,0,0.7)":"none"}}/>
          </div>
        </div>
      </div>
      <div style={{padding:"0 16px"}}>
        {wrongQuizIds.length>0&&(
          <div onClick={onStartRetry} style={{marginTop:16,background:"#FFF3E0",border:"2px solid #FF9800",borderRadius:20,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"transform 0.1s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            onTouchStart={e=>e.currentTarget.style.transform="scale(0.97)"} onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{fontSize:32}}>📝</div>
            <div><div style={{fontWeight:800,fontSize:15,color:"#E65100"}}>まちがい直し</div><div style={{fontSize:12,color:"#BF360C",marginTop:2}}>{wrongQuizIds.length}問のまちがいをまとめて解こう！</div></div>
            <div style={{marginLeft:"auto",fontSize:22}}>→</div>
          </div>
        )}
        <div style={{marginTop:16}}>
          <div style={{fontWeight:700,fontSize:13,color:"#555",marginBottom:10}}>📚 単元を選んで！</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {UNITS.map(unit=>{
              const correctIds=correctIdsMap[unit.id]||new Set();
              const{done,total}=calcUnitProgress(unit,correctIds);
              const completed=done===total;
              return(
                <div key={unit.id} onClick={()=>onStart(unit)}
                  style={{background:"#fff",borderRadius:18,padding:"14px",boxShadow:"0 3px 16px rgba(0,0,0,0.07)",cursor:"pointer",border:`2px solid ${completed?unit.color:"transparent"}`,display:"flex",alignItems:"center",gap:12,transition:"transform 0.1s"}}
                  onTouchStart={e=>e.currentTarget.style.transform="scale(0.97)"} onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
                  onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                  <div style={{width:52,height:52,background:unit.bg,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{unit.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:14,color:"#333"}}>{unit.title}</div>
                    <div style={{fontSize:10,color:"#aaa",marginTop:1}}>{unit.topics[0]}など</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:5}}>
                      <div style={{height:5,background:"#f0f0f0",borderRadius:9,flex:1}}><div style={{height:5,background:unit.color,borderRadius:9,width:`${(done/total)*100}%`,transition:"width 0.6s"}}/></div>
                      <span style={{fontSize:10,color:"#bbb",whiteSpace:"nowrap"}}>{done}/{total}問</span>
                    </div>
                  </div>
                  {completed&&<div style={{fontSize:20,flexShrink:0}}>✅</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryScreen({history,badges}){
  const CHART_DAYS=7,BAR_WIDTH=28;
  const days=useMemo(()=>{const map={};history.forEach(h=>{if(!map[h.date])map[h.date]={date:h.date,total:0,correct:0};map[h.date].total++;if(h.correct)map[h.date].correct++;});const result=[];for(let i=CHART_DAYS-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=d.toLocaleDateString("ja-JP",{month:"2-digit",day:"2-digit"});result.push(map[key]||{date:key,total:0,correct:0});}return result;},[history]);
  const maxTotal=Math.max(...days.map(d=>d.total),1),CHART_H=110,chartWidth=CHART_DAYS*(BAR_WIDTH+8);
  const getX=(i)=>i*(BAR_WIDTH+8)+(BAR_WIDTH/2);
  const getY=(d)=>d.total===0?CHART_H:CHART_H-Math.max((d.correct/d.total)*CHART_H,4);
  const linePoints=days.map((d,i)=>({x:getX(i),y:getY(d),rate:d.total===0?null:Math.round((d.correct/d.total)*100)}));
  const validPoints=linePoints.filter(p=>p.rate!==null);
  const polyline=validPoints.map(p=>`${p.x},${p.y}`).join(" ");
  const totalAnswered=history.length,totalCorrect=history.filter(h=>h.correct).length;
  const rate=totalAnswered>0?Math.round((totalCorrect/totalAnswered)*100):0;
  const isEmpty=days.every(d=>d.total===0);
  return(
    <div style={{padding:"20px 16px 90px"}}>
      <div style={{fontWeight:900,fontSize:18,color:"#333",marginBottom:16}}>📊 学習記録</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[{label:"解いた問題",value:totalAnswered,sfx:"問",color:"#FF8C00"},{label:"正解数",value:totalCorrect,sfx:"問",color:"#66BB6A"},{label:"正解率",value:rate,sfx:"%",color:"#FFA726"}].map(s=>(
          <div key={s.label} style={{background:"#fff",borderRadius:14,padding:"12px 8px",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.value}<span style={{fontSize:12}}>{s.sfx}</span></div>
            <div style={{fontSize:10,color:"#aaa",marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:20,padding:"16px",boxShadow:"0 3px 16px rgba(0,0,0,0.07)",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:13,color:"#555",marginBottom:10}}>🏅 ゲットしたバッジ</div>
        {badges.length===0?(<div style={{fontSize:12,color:"#ccc",textAlign:"center",padding:"10px 0"}}>クイズを解いてバッジをゲットしよう！</div>):(
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {badges.map(b=>(<div key={b.id} style={{background:"#FFF9C4",border:"2px solid #FFD700",borderRadius:12,padding:"6px 10px",fontSize:11,display:"flex",alignItems:"center",gap:4,fontWeight:700}}><span>{b.emoji}</span><div><div>{b.label}</div><div style={{fontSize:9,color:"#999",fontWeight:500}}>{b.desc}</div></div></div>))}
          </div>
        )}
      </div>
      <div style={{background:"#fff",borderRadius:20,padding:"18px 14px",boxShadow:"0 3px 16px rgba(0,0,0,0.07)",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:13,color:"#555",marginBottom:2}}>日ごとの学習の様子（直近7日）</div>
        <div style={{fontSize:10,color:"#aaa",marginBottom:10}}>棒グラフ：解いた問題数　折れ線：正解率</div>
        {isEmpty?(<div style={{textAlign:"center",padding:"20px 0",color:"#ccc",fontSize:13}}>まだ記録がないよ。問題を解くと記録されるよ！</div>):(
          <>
            <div style={{display:"flex",gap:0}}>
              <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",height:CHART_H+20,paddingBottom:20,width:26,flexShrink:0}}>
                {[maxTotal,Math.round(maxTotal/2),0].map((v,i)=>(<div key={i} style={{fontSize:9,color:"#bbb",textAlign:"right"}}>{v}</div>))}
              </div>
              <div style={{flex:1,overflowX:"auto"}}>
                <div style={{position:"relative",width:chartWidth,height:CHART_H+20}}>
                  <svg style={{position:"absolute",top:0,left:0}} width={chartWidth} height={CHART_H}>
                    {[0,0.5,1].map((r,i)=>(<line key={i} x1={0} y1={CHART_H*r} x2={chartWidth} y2={CHART_H*r} stroke="#f0f0f0" strokeWidth={1}/>))}
                  </svg>
                  <div style={{display:"flex",gap:8,alignItems:"flex-end",height:CHART_H,position:"relative",zIndex:1}}>
                    {days.map((d,i)=>{const barH=d.total===0?2:Math.max((d.total/maxTotal)*CHART_H,4);return(<div key={d.date} style={{width:BAR_WIDTH,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:CHART_H}}>{d.total>0&&<div style={{fontSize:9,fontWeight:700,color:"#FF8C00",marginBottom:2}}>{d.total}</div>}<div style={{width:BAR_WIDTH,height:barH,background:d.total>0?"#FFE0B2":"#f5f5f5",borderRadius:"5px 5px 0 0"}}/></div>);})}
                  </div>
                  {validPoints.length>=1&&(<svg style={{position:"absolute",top:0,left:0,zIndex:2,pointerEvents:"none"}} width={chartWidth} height={CHART_H}>{validPoints.length>=2&&<polyline points={polyline} fill="none" stroke="#FF8C00" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>}{linePoints.map((p,i)=>p.rate!==null?(<g key={i}><circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#FF8C00" strokeWidth={2}/><text x={p.x} y={p.y-7} textAnchor="middle" fontSize={9} fill="#FF8C00" fontWeight={700}>{p.rate}%</text></g>):null)}</svg>)}
                  <div style={{display:"flex",gap:8,height:20,alignItems:"center"}}>{days.map(d=>(<div key={d.date} style={{width:BAR_WIDTH,flexShrink:0,textAlign:"center",fontSize:9,color:"#aaa"}}>{d.date}</div>))}</div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",height:CHART_H+20,paddingBottom:20,width:26,flexShrink:0}}>
                {["100%","50%","0%"].map((v,i)=>(<div key={i} style={{fontSize:9,color:"#FF8C00",textAlign:"left"}}>{v}</div>))}
              </div>
            </div>
            <div style={{display:"flex",gap:14,marginTop:8,justifyContent:"center"}}>
              {[{color:"#FFE0B2",label:"解いた問題数",type:"bar"},{color:"#FF8C00",label:"正解率",type:"line"}].map(l=>(<div key={l.label} style={{display:"flex",alignItems:"center",gap:4}}>{l.type==="bar"?<div style={{width:12,height:12,background:l.color,borderRadius:3,border:"1px solid #ddd"}}/>:<svg width={20} height={12}><line x1={0} y1={6} x2={20} y2={6} stroke={l.color} strokeWidth={2}/><circle cx={10} cy={6} r={3} fill="#fff" stroke={l.color} strokeWidth={2}/></svg>}<span style={{fontSize:11,color:"#888"}}>{l.label}</span></div>))}
            </div>
          </>
        )}
      </div>
      <div style={{background:"#fff",borderRadius:20,padding:"18px 16px",boxShadow:"0 3px 16px rgba(0,0,0,0.07)"}}>
        <div style={{fontWeight:700,fontSize:13,color:"#555",marginBottom:14}}>単元別 正解率</div>
        {UNITS.map(unit=>{
          const uH=history.filter(h=>h.unitId===unit.id);
          if(uH.length===0)return(<div key={unit.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><span style={{fontSize:18,width:24}}>{unit.emoji}</span><span style={{fontSize:12,color:"#aaa",flex:1}}>{unit.title}</span><span style={{fontSize:11,color:"#ccc"}}>未挑戦</span></div>);
          const r=Math.round((uH.filter(h=>h.correct).length/uH.length)*100);
          return(<div key={unit.id} style={{marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:16}}>{unit.emoji}</span><span style={{fontSize:12,fontWeight:700,color:"#444",flex:1}}>{unit.title}</span><span style={{fontSize:12,fontWeight:900,color:unit.color}}>{r}%</span></div><div style={{height:6,background:"#f0f0f0",borderRadius:9}}><div style={{height:6,background:unit.color,borderRadius:9,width:`${r}%`,transition:"width 0.6s"}}/></div></div>);
        })}
      </div>
    </div>
  );
}

function UnitScreen({unit,correctIds,resumeIndex,onStartQuiz,onBack}){
  const snd=useSound();
  const total=unit.quizzes.length;
  const{done}=calcUnitProgress(unit,correctIds);
  const hasProgress=resumeIndex>0&&resumeIndex<total;
  const prevStars=done===total?3:done>=Math.ceil(total/2)?2:done>0?1:0;
  return(
    <div style={{paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${unit.color}dd,${unit.color}88)`,borderRadius:"0 0 28px 28px",padding:"24px 20px 20px",color:"#fff"}}>
        <button onClick={()=>{snd.tap();onBack();}} style={{background:"rgba(255,255,255,0.25)",border:"none",color:"#fff",borderRadius:10,padding:"5px 12px",fontWeight:700,cursor:"pointer",marginBottom:14}}>← もどる</button>
        <div style={{fontSize:44,textAlign:"center"}}>{unit.emoji}</div>
        <div style={{fontSize:20,fontWeight:900,textAlign:"center",marginTop:8}}>{unit.title}</div>
      </div>
      <div style={{padding:"18px 16px"}}>
        <div style={{background:"#fff",borderRadius:18,padding:14,boxShadow:"0 3px 16px rgba(0,0,0,0.07)",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#555",marginBottom:10}}>📖 この単元で学ぶこと</div>
          {unit.topics.map((t,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<unit.topics.length-1?"1px dashed #eee":"none"}}><div style={{width:22,height:22,background:unit.bg,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:unit.color,flexShrink:0}}>{i+1}</div><div style={{fontSize:13,color:"#333"}}>{t}</div></div>))}
        </div>
        {prevStars>0&&(<div style={{background:"#FFF9C4",border:"2px solid #FFD700",borderRadius:14,padding:"10px 14px",marginBottom:14,textAlign:"center"}}><div style={{fontSize:12,fontWeight:700,color:"#B8860B"}}>これまでの記録</div><Stars count={prevStars}/><div style={{fontSize:11,color:"#aaa",marginTop:4}}>{done}/{total}問 正解済み</div></div>)}
        <button onClick={()=>{snd.tap();onStartQuiz(false);}} style={{width:"100%",background:`linear-gradient(135deg,${unit.color},${unit.color}bb)`,color:"#fff",border:"none",borderRadius:18,padding:"16px",fontSize:17,fontWeight:900,cursor:"pointer",boxShadow:`0 6px 20px ${unit.color}44`}}>
          {hasProgress?"⏭ 続きから挑戦！":"🎮 クイズに挑戦！"} ({total}問)
        </button>
        {hasProgress&&(<button onClick={()=>{snd.tap();onStartQuiz(true);}} style={{width:"100%",background:"#fff",color:"#888",border:"2px solid #eee",borderRadius:18,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:10}}>最初からやり直す</button>)}
      </div>
    </div>
  );
}

function QuizScreen({quizzes,unitColor,unitEmoji,unitTitle,isRetry,startIndex=0,onComplete,onAbort}){
  const snd=useSound();
  const[shuffledQuizzes]=useState(()=>quizzes.map(q=>shuffleChoices(q)));
  const[current,setCurrent]=useState(startIndex);
  const[selected,setSelected]=useState(null);
  const[results,setResults]=useState([]);
  const[showHint,setShowHint]=useState(false);
  const[streak,setStreak]=useState(0);
  const[startTime,setStartTime]=useState(Date.now());
  const[fastAnswer,setFastAnswer]=useState(false);
  const[confetti,setConfetti]=useState(false);
  const[finished,setFinished]=useState(false);
  const[newBadges,setNewBadges]=useState([]);
  const quiz=shuffledQuizzes[current];
  const isLast=current===shuffledQuizzes.length-1;
  const color=unitColor||"#FF8C00";
  useEffect(()=>{setStartTime(Date.now());setShowHint(false);setSelected(null);setFastAnswer(false);},[current]);
  const handleSelect=(idx)=>{
    if(selected!==null)return;
    const elapsed=(Date.now()-startTime)/1000;
    const correct=idx===quiz.answer;
    setSelected(idx);
    const newResults=[...results,{quizId:quiz.id,correct}];
    setResults(newResults);
    const newStreak=correct?streak+1:0;
    setStreak(newStreak);
    const fast=elapsed<=5&&correct;
    setFastAnswer(fast);
    if(correct){if(newStreak>=3)snd.streak();else snd.correct();setConfetti(true);setTimeout(()=>setConfetti(false),2000);}else{snd.wrong();}
    if(isLast){setTimeout(()=>{const correctCount=newResults.filter(r=>r.correct).length;const stars=correctCount===shuffledQuizzes.length?3:correctCount>=Math.ceil(shuffledQuizzes.length/2)?2:1;const earned=[];if(!isRetry&&newResults.length===1)earned.push("first_quiz");if(newStreak>=3)earned.push("streak3");if(fast)earned.push("fast_answer");if(correctCount===shuffledQuizzes.length){earned.push("perfect");if(isRetry)earned.push("retry_clear");}if(earned.length>0)snd.badge();else snd.clear();setNewBadges(earned);setFinished(true);onComplete(newResults,stars,earned);},1200);}
  };
  if(finished){
    const correct=results.filter(r=>r.correct).length;
    const stars=correct===shuffledQuizzes.length?3:correct>=Math.ceil(shuffledQuizzes.length/2)?2:1;
    return(<div style={{padding:"32px 20px",textAlign:"center",paddingBottom:90}}><Confetti active={stars===3}/><div style={{fontSize:64}}>{stars===3?"🏆":stars===2?"🥈":"🥉"}</div><div style={{fontSize:24,fontWeight:900,color:"#333",marginTop:10}}>{stars===3?"かんぺき！！":stars===2?"よくできました！":"がんばったね！"}</div><div style={{fontSize:15,color:"#666",marginTop:8}}>{shuffledQuizzes.length}問中 <span style={{fontWeight:900,fontSize:20,color}}>{correct}</span>問 正解！</div><div style={{marginTop:12}}><Stars count={stars}/></div>{newBadges.length>0&&(<div style={{margin:"18px 0",background:"#FFF9C4",borderRadius:16,padding:14,border:"2px solid #FFD700"}}><div style={{fontWeight:700,fontSize:13,color:"#B8860B",marginBottom:6}}>🎉 バッジをゲット！</div>{newBadges.map(id=>{const b=BADGES.find(x=>x.id===id);return b?(<div key={id} style={{fontSize:13,marginBottom:3}}>{b.emoji} <strong>{b.label}</strong> — {b.desc}</div>):null;})}</div>)}<button onClick={()=>onAbort([])} style={{marginTop:16,background:`linear-gradient(135deg,${color},${color}99)`,color:"#fff",border:"none",borderRadius:20,padding:"14px 40px",fontSize:16,fontWeight:900,cursor:"pointer"}}>ホームにもどる 🏠</button></div>);
  }
  return(
    <div style={{paddingBottom:80}}>
      <Confetti active={confetti&&selected===quiz.answer}/>
      <div style={{background:`linear-gradient(135deg,${color}cc,${color}88)`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>onAbort(results)} style={{background:"rgba(255,255,255,0.3)",border:"none",color:"#fff",borderRadius:10,padding:"4px 12px",fontWeight:700,cursor:"pointer",fontSize:12}}>✕</button>
        <div style={{color:"#fff",fontWeight:800,fontSize:13}}>{unitEmoji} {unitTitle}</div>
        <div style={{background:"rgba(255,255,255,0.25)",borderRadius:10,padding:"3px 10px",color:"#fff",fontWeight:900,fontSize:13}}>{current+1}/{shuffledQuizzes.length}</div>
      </div>
      <div style={{height:6,background:"#f0f0f0"}}><div style={{height:6,background:color,width:`${((current+(selected!==null?1:0))/shuffledQuizzes.length)*100}%`,transition:"width 0.4s"}}/></div>
      {streak>=2&&(<div style={{background:"#FFF3E0",padding:"5px 16px",textAlign:"center",fontSize:12,fontWeight:700,color:"#E65100"}}>🔥 {streak}連続正解中！</div>)}
      <div style={{padding:"16px"}}>
        <div style={{background:"#fff",borderRadius:22,padding:"18px",boxShadow:"0 5px 20px rgba(0,0,0,0.08)",marginBottom:16}}>
          <div style={{fontSize:32,textAlign:"center",marginBottom:10}}>{quiz.emoji}</div>
          <div style={{fontSize:16,fontWeight:800,color:"#333",lineHeight:1.65,textAlign:"center"}}>{quiz.q}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {quiz.choices.map((ch,i)=>{const isCorrect=i===quiz.answer,isSel=i===selected;let bg="#fff",border="2px solid #eee",col="#333";if(selected!==null){if(isCorrect){bg="#E8F5E9";border="2px solid #66BB6A";col="#2E7D32";}else if(isSel&&!isCorrect){bg="#FFEBEE";border="2px solid #EF5350";col="#C62828";}}return(<button key={i} onClick={()=>handleSelect(i)} style={{background:bg,border,borderRadius:14,padding:"12px 14px",fontSize:14,fontWeight:700,color:col,cursor:selected!==null?"default":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}><span style={{width:28,height:28,background:selected!==null?(isCorrect?"#66BB6A":isSel?"#EF5350":"#f0f0f0"):"#EEF2FF",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:selected!==null?(isCorrect||isSel?"#fff":"#aaa"):color,flexShrink:0}}>{["A","B","C","D"][i]}</span><span style={{flex:1}}>{ch}</span>{selected!==null&&isCorrect&&<span>✅</span>}{selected!==null&&isSel&&!isCorrect&&<span>❌</span>}</button>);})}
        </div>
        {selected===null&&(<button onClick={()=>setShowHint(h=>!h)} style={{marginTop:12,background:"transparent",border:"2px dashed #e0e0e0",borderRadius:12,padding:"9px 16px",color:"#bbb",fontSize:12,fontWeight:700,cursor:"pointer",width:"100%"}}>💡 ヒントを見る</button>)}
        {showHint&&selected===null&&(<div style={{marginTop:6,background:"#FFFDE7",borderRadius:12,padding:"10px 14px",fontSize:12,color:"#795548",border:"1px solid #FFD54F",fontWeight:600}}>💡 {quiz.hint}</div>)}
        {selected!==null&&(<div style={{marginTop:14}}><div style={{background:selected===quiz.answer?"#E8F5E9":"#FFEBEE",borderRadius:14,padding:"12px 14px",fontSize:13,color:selected===quiz.answer?"#2E7D32":"#C62828",fontWeight:700,marginBottom:10}}>{selected===quiz.answer?`🎉 正解！${fastAnswer?" ⚡ はやい！":""}`:`😅 ざんねん！正解は「${quiz.choices[quiz.answer]}」`}<div style={{fontWeight:600,marginTop:4,fontSize:12}}>💡 {quiz.hint}</div></div>{!isLast&&(<button onClick={()=>{snd.tap();setCurrent(c=>c+1);}} style={{width:"100%",background:`linear-gradient(135deg,${color},${color}aa)`,color:"#fff",border:"none",borderRadius:14,padding:"13px",fontSize:15,fontWeight:900,cursor:"pointer"}}>次の問題へ →</button>)}</div>)}
      </div>
    </div>
  );
}

export default function App(){
  const[tab,setTab]=useState("home");
  const[screen,setScreen]=useState("home");
  const[activeUnit,setActiveUnit]=useState(null);
  const[restartFromZero,setRestartFromZero]=useState(false);
  const[correctIdsMap,setCorrectIdsMap]=useState(()=>{const saved=loadState();if(saved?.correctIdsMap){const result={};for(const[k,v]of Object.entries(saved.correctIdsMap)){result[Number(k)]=new Set(v);}return result;}return{};});
  const[resumeIndexMap,setResumeIndexMap]=useState(()=>{const saved=loadState();return saved?.resumeIndexMap||{};});
  const[wrongQuizIds,setWrongQuizIds]=useState(()=>{const saved=loadState();return saved?.wrongQuizIds||[];});
  const[history,setHistory]=useState(()=>{const saved=loadState();return saved?.history||[];});
  const[earnedBadges,setEarnedBadges]=useState(()=>{const saved=loadState();if(saved?.earnedBadgeIds){return BADGES.filter(b=>saved.earnedBadgeIds.includes(b.id));}return[];});
  useEffect(()=>{const serialized={};for(const[k,v]of Object.entries(correctIdsMap)){serialized[k]=[...v];}saveState({correctIdsMap:serialized,resumeIndexMap,wrongQuizIds,history,earnedBadgeIds:earnedBadges.map(b=>b.id)});},[correctIdsMap,resumeIndexMap,wrongQuizIds,history,earnedBadges]);
  const addCorrectIds=useCallback((unitId,quizIds)=>{if(!unitId||quizIds.length===0)return;setCorrectIdsMap(prev=>{const next={...prev};const existing=new Set(next[unitId]||[]);quizIds.forEach(id=>existing.add(id));next[unitId]=existing;return next;});},[]);
  const saveResults=useCallback((results,unitId,isRetryMode)=>{if(!results||results.length===0)return;const date=todayStr();setHistory(h=>[...h,...results.map(r=>({date,unitId,quizId:r.quizId,correct:r.correct}))]);const correctedIds=results.filter(r=>r.correct).map(r=>r.quizId);if(unitId&&correctedIds.length>0)addCorrectIds(unitId,correctedIds);setWrongQuizIds(prev=>{const s=new Set(prev);results.forEach(r=>{if(r.correct)s.delete(r.quizId);else if(!isRetryMode)s.add(r.quizId);});return[...s];});},[addCorrectIds]);
  const handleComplete=useCallback((results,stars,newBadgeIds)=>{const unitId=activeUnit?activeUnit.id:null;saveResults(results,unitId,screen==="retry");if(unitId)setResumeIndexMap(prev=>({...prev,[unitId]:0}));if(newBadgeIds&&newBadgeIds.length>0){setEarnedBadges(prev=>{const exist=new Set(prev.map(b=>b.id));const toAdd=BADGES.filter(b=>newBadgeIds.includes(b.id)&&!exist.has(b.id));return toAdd.length>0?[...prev,...toAdd]:prev;});}setTimeout(()=>{setCorrectIdsMap(currentMap=>{const allDone=UNITS.every(u=>{const cids=currentMap[u.id]||new Set();return u.quizzes.every(q=>cids.has(q.id));});if(allDone){setEarnedBadges(prev=>{if(prev.find(b=>b.id==="all_units"))return prev;const badge=BADGES.find(b=>b.id==="all_units");return badge?[...prev,badge]:prev;});}return currentMap;});},100);},[activeUnit,screen,saveResults]);
  const handleAbort=useCallback((results)=>{const unitId=activeUnit?activeUnit.id:null;saveResults(results,unitId,screen==="retry");if(unitId&&results&&results.length>0&&screen!=="retry"){setResumeIndexMap(prev=>({...prev,[unitId]:results.length}));}setScreen("home");},[activeUnit,screen,saveResults]);
  const retryQuizzes=useMemo(()=>{const all=UNITS.flatMap(u=>u.quizzes);return wrongQuizIds.map(id=>all.find(q=>q.id===id)).filter(Boolean);},[wrongQuizIds]);
  const color=activeUnit?activeUnit.color:"#FF8C00";
  const activeResumeIndex=activeUnit?(restartFromZero?0:(resumeIndexMap[activeUnit.id]||0)):0;
  const activeCorrectIds=activeUnit?(correctIdsMap[activeUnit.id]||new Set()):new Set();
  return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:"#F0F4FF",fontFamily:"'Hiragino Kaku Gothic ProN','Hiragino Sans','Noto Sans JP',sans-serif",position:"relative"}}>
      <style>{`@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}button{-webkit-tap-highlight-color:transparent}`}</style>
      {tab==="home"&&screen==="home"&&(<HomeScreen correctIdsMap={correctIdsMap} wrongQuizIds={wrongQuizIds} onStart={unit=>{setActiveUnit(unit);setRestartFromZero(false);setScreen("unit");}} onStartRetry={()=>setScreen("retry")}/>)}
      {tab==="home"&&screen==="unit"&&activeUnit&&(<UnitScreen unit={activeUnit} correctIds={activeCorrectIds} resumeIndex={resumeIndexMap[activeUnit.id]||0} onStartQuiz={fromZero=>{setRestartFromZero(!!fromZero);setScreen("quiz");}} onBack={()=>setScreen("home")}/>)}
      {tab==="home"&&screen==="quiz"&&activeUnit&&(<QuizScreen quizzes={activeUnit.quizzes} unitColor={color} unitEmoji={activeUnit.emoji} unitTitle={activeUnit.title} isRetry={false} startIndex={activeResumeIndex} onComplete={handleComplete} onAbort={handleAbort}/>)}
      {tab==="home"&&screen==="retry"&&(<QuizScreen quizzes={retryQuizzes} unitColor="#FF9800" unitEmoji="📝" unitTitle="まちがい直し" isRetry={true} startIndex={0} onComplete={handleComplete} onAbort={handleAbort}/>)}
      {tab==="history"&&(<HistoryScreen history={history} badges={earnedBadges}/>)}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:"#fff",borderTop:"1px solid #e8eaf6",display:"flex",padding:"8px 0 12px",boxShadow:"0 -4px 20px rgba(0,0,0,0.06)"}}>
        {[{id:"home",emoji:"🏠",label:"ホーム"},{id:"history",emoji:"📊",label:"学習記録"}].map(t=>(<button key={t.id} onClick={()=>{setTab(t.id);if(t.id==="home")setScreen("home");}} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,opacity:tab===t.id?1:0.4,transition:"opacity 0.2s"}}><span style={{fontSize:22}}>{t.emoji}</span><span style={{fontSize:10,fontWeight:700,color:tab===t.id?"#FF8C00":"#888"}}>{t.label}</span></button>))}
      </div>
    </div>
  );
}
