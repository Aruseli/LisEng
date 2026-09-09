/**
 * Контекстные примеры (base / past / participle) для списка глаголов.
 * Без шаблона "I X every day".
 */

export type VerbExample = {
  form_type: 'base' | 'past' | 'participle'
  sentence_en: string
  sentence_ru: string
  context: string
}

function t(
  base: [string, string],
  past: [string, string],
  part: [string, string],
): VerbExample[] {
  return [
    { form_type: 'base', sentence_en: base[0], sentence_ru: base[1], context: 'Present Simple' },
    { form_type: 'past', sentence_en: past[0], sentence_ru: past[1], context: 'Past Simple' },
    { form_type: 'participle', sentence_en: part[0], sentence_ru: part[1], context: 'Present Perfect' },
  ]
}

export const LIST_EXAMPLES: Record<string, VerbExample[]> = {
  eat: t(
    ['I eat lunch at school.', 'Я обедаю в школе.'],
    ['Yesterday I ate pasta.', 'Вчера я ел пасту.'],
    ['I have eaten here before.', 'Я уже ел здесь раньше.'],
  ),
  set: t(
    ['I set the table before dinner.', 'Я накрываю на стол перед ужином.'],
    ['She set the alarm for six.', 'Она поставила будильник на шесть.'],
    ['I have set a new record.', 'Я поставил новый рекорд.'],
  ),
  cost: t(
    ['This ticket costs too much.', 'Этот билет стоит слишком дорого.'],
    ['The repair cost us a hundred pounds.', 'Ремонт обошёлся нам в сто фунтов.'],
    ['It has cost me a lot of time.', 'Это отняло у меня много времени.'],
  ),
  hurt: t(
    ['My knee hurts after running.', 'После пробежки болит колено.'],
    ['He hurt his hand yesterday.', 'Вчера он ушиб руку.'],
    ['I have hurt myself on that nail.', 'Я уже поранился об этот гвоздь.'],
  ),
  let: t(
    ['They let us use the kitchen.', 'Они разрешают нам пользоваться кухней.'],
    ['Mom let me stay up late.', 'Мама разрешила мне не ложиться рано.'],
    ['She has let the dog out.', 'Она уже выпустила собаку.'],
  ),
  catch: t(
    ['I catch the bus at eight.', 'Я сажусь на автобус в восемь.'],
    ['She caught the ball easily.', 'Она легко поймала мяч.'],
    ['I have caught a cold.', 'Я простудился.'],
  ),
  hear: t(
    ['I hear music from the next room.', 'Я слышу музыку из соседней комнаты.'],
    ['We heard a strange noise.', 'Мы услышали странный звук.'],
    ['I have heard this song before.', 'Я уже слышал эту песню.'],
  ),
  hold: t(
    ['Please hold my bag for a second.', 'Подержи мою сумку секунду.'],
    ['He held the door open.', 'Он держал дверь открытой.'],
    ['I have held this job for two years.', 'Я работаю здесь уже два года.'],
  ),
  lead: t(
    ['Good teachers lead by example.', 'Хорошие учителя ведут за собой примером.'],
    ['She led the team to victory.', 'Она привела команду к победе.'],
    ['He has led many projects.', 'Он руководил многими проектами.'],
  ),
  learn: t(
    ['I learn new words every evening.', 'Я учу новые слова каждый вечер.'],
    ['She learnt French at school.', 'Она учила французский в школе.'],
    ['I have learnt a lot this month.', 'Я многому научился в этом месяце.'],
  ),
  leave: t(
    ['I leave home at seven.', 'Я ухожу из дома в семь.'],
    ['He left his keys on the table.', 'Он оставил ключи на столе.'],
    ['She has left the office already.', 'Она уже ушла из офиса.'],
  ),
  lose: t(
    ['I often lose my gloves.', 'Я часто теряю перчатки.'],
    ['We lost the match 2–1.', 'Мы проиграли матч со счётом 2:1.'],
    ['I have lost my ticket.', 'Я потерял билет.'],
  ),
  mean: t(
    ['What does this word mean?', 'Что значит это слово?'],
    ['I meant to call you yesterday.', 'Я хотел тебе вчера позвонить.'],
    ['I have always meant what I said.', 'Я всегда говорил то, что думал.'],
  ),
  meet: t(
    ['We meet after class on Fridays.', 'По пятницам мы встречаемся после уроков.'],
    ['I met her at the station.', 'Я встретил её на вокзале.'],
    ['Have you met my brother?', 'Ты уже знаком с моим братом?'],
  ),
  pay: t(
    ['I pay the rent on the first day.', 'Я плачу аренду первого числа.'],
    ['She paid for the tickets.', 'Она оплатила билеты.'],
    ['I have paid the bill already.', 'Я уже оплатил счёт.'],
  ),
  sell: t(
    ['They sell fresh bread here.', 'Здесь продают свежий хлеб.'],
    ['He sold his old bike.', 'Он продал старый велосипед.'],
    ['We have sold the last copy.', 'Мы продали последний экземпляр.'],
  ),
  sit: t(
    ['I sit by the window.', 'Я сижу у окна.'],
    ['She sat next to me.', 'Она села рядом со мной.'],
    ['I have sat here for an hour.', 'Я сижу здесь уже час.'],
  ),
  sleep: t(
    ['The baby sleeps after lunch.', 'Малыш спит после обеда.'],
    ['I slept badly last night.', 'Прошлой ночью я плохо спал.'],
    ['I have not slept enough.', 'Я мало спал.'],
  ),
  spend: t(
    ['I spend weekends with my family.', 'Я провожу выходные с семьёй.'],
    ['We spent all the money.', 'Мы потратили все деньги.'],
    ['I have spent too much time on this.', 'Я потратил на это слишком много времени.'],
  ),
  stand: t(
    ['Please stand in a line.', 'Пожалуйста, встаньте в очередь.'],
    ['He stood at the door.', 'Он стоял у двери.'],
    ['I have stood here since morning.', 'Я стою здесь с утра.'],
  ),
  understand: t(
    ['I understand the question now.', 'Теперь я понимаю вопрос.'],
    ['She understood him perfectly.', 'Она отлично его поняла.'],
    ['I have never understood this rule.', 'Я так и не понял это правило.'],
  ),
  win: t(
    ['Our team wins almost every game.', 'Наша команда выигрывает почти каждый матч.'],
    ['They won the cup last year.', 'В прошлом году они выиграли кубок.'],
    ['I have won twice already.', 'Я уже побеждал дважды.'],
  ),
  drive: t(
    ['I drive to work on weekdays.', 'По будням я езжу на работу на машине.'],
    ['She drove us to the airport.', 'Она отвезла нас в аэропорт.'],
    ['I have driven this road many times.', 'Я много раз ездил по этой дороге.'],
  ),
  fall: t(
    ['Leaves fall in October.', 'В октябре опадают листья.'],
    ['He fell off the bike.', 'Он упал с велосипеда.'],
    ['The price has fallen again.', 'Цена снова упала.'],
  ),
  fly: t(
    ['Birds fly south in autumn.', 'Осенью птицы улетают на юг.'],
    ['We flew to Rome last May.', 'В мае мы летали в Рим.'],
    ['I have flown this airline before.', 'Я уже летал этой авиакомпанией.'],
  ),
  forget: t(
    ['I never forget my password.', 'Я никогда не забываю пароль.'],
    ['She forgot her umbrella.', 'Она забыла зонт.'],
    ['I have forgotten his name.', 'Я забыл его имя.'],
  ),
  grow: t(
    ['Tomatoes grow well here.', 'Здесь хорошо растут помидоры.'],
    ['The city grew quickly.', 'Город быстро вырос.'],
    ['She has grown so tall.', 'Она так выросла.'],
  ),
  ride: t(
    ['I ride my bike to school.', 'Я езжу в школу на велосипеде.'],
    ['He rode a horse for the first time.', 'Он впервые прокатился на лошади.'],
    ['I have ridden this trail before.', 'Я уже ездил по этой тропе.'],
  ),
  show: t(
    ['Can you show me the way?', 'Можешь показать мне дорогу?'],
    ['She showed us her photos.', 'Она показала нам свои фото.'],
    ['They have shown real progress.', 'Они показали настоящий прогресс.'],
  ),
  throw: t(
    ['Do not throw paper on the floor.', 'Не бросай бумагу на пол.'],
    ['He threw the ball to me.', 'Он бросил мне мяч.'],
    ['I have thrown the old box away.', 'Я выбросил старую коробку.'],
  ),
  wake: t(
    ['I wake up at six.', 'Я просыпаюсь в шесть.'],
    ['The noise woke the baby.', 'Шум разбудил малыша.'],
    ['I have woken up twice tonight.', 'Сегодня ночью я просыпался дважды.'],
  ),
  wear: t(
    ['I wear a jacket in autumn.', 'Осенью я ношу куртку.'],
    ['She wore a red dress.', 'На ней было красное платье.'],
    ['I have worn these shoes all week.', 'Я ношу эти туфли всю неделю.'],
  ),
  become: t(
    ['It becomes cold after sunset.', 'После заката становится холодно.'],
    ['She became a doctor.', 'Она стала врачом.'],
    ['He has become more confident.', 'Он стал увереннее.'],
  ),
  run: t(
    ['I run in the park on Sundays.', 'По воскресеньям я бегаю в парке.'],
    ['She ran to catch the train.', 'Она побежала, чтобы успеть на поезд.'],
    ['I have run five kilometres today.', 'Сегодня я пробежал пять километров.'],
  ),
  bet: t(
    ['I never bet on sports.', 'Я никогда не ставлю на спорт.'],
    ['He bet ten pounds on that horse.', 'Он поставил десять фунтов на эту лошадь.'],
    ['I have never bet so much.', 'Я никогда не ставил так много.'],
  ),
  bid: t(
    ['Buyers bid on the painting.', 'Покупатели делают ставки на картину.'],
    ['She bid a high price.', 'Она предложила высокую цену.'],
    ['They have bid on this house twice.', 'Они уже дважды торговались за этот дом.'],
  ),
  burst: t(
    ['Balloons burst if you sit on them.', 'Шарики лопаются, если на них сесть.'],
    ['The pipe burst last night.', 'Ночью лопнула труба.'],
    ['The bag has burst at the seam.', 'Сумка лопнула по шву.'],
  ),
  cast: t(
    ['Actors cast a shadow on the wall.', 'Актёры отбрасывают тень на стену.'],
    ['She cast her vote yesterday.', 'Вчера она отдала свой голос.'],
    ['He has cast the role already.', 'Он уже утвердил роль.'],
  ),
  forecast: t(
    ['They forecast rain for Friday.', 'На пятницу обещают дождь.'],
    ['The radio forecast a storm.', 'По радио обещали шторм.'],
    ['They have forecast a cold winter.', 'Они прогнозируют холодную зиму.'],
  ),
  knit: t(
    ['Grandma knits warm socks.', 'Бабушка вяжет тёплые носки.'],
    ['She knit a scarf last winter.', 'Прошлой зимой она связала шарф.'],
    ['I have knit two hats this year.', 'В этом году я связала две шапки.'],
  ),
  offset: t(
    ['Trees offset some of the carbon.', 'Деревья компенсируют часть углерода.'],
    ['The bonus offset the extra costs.', 'Премия покрыла лишние расходы.'],
    ['We have offset the delay.', 'Мы уже компенсировали задержку.'],
  ),
  output: t(
    ['The printer outputs ten pages a minute.', 'Принтер выдаёт десять страниц в минуту.'],
    ['The factory output more parts last week.', 'На прошлой неделе завод выпустил больше деталей.'],
    ['The system has output the report.', 'Система уже вывела отчёт.'],
  ),
  proofread: t(
    ['I proofread every email twice.', 'Я дважды вычитываю каждое письмо.'],
    ['She proofread the article last night.', 'Она вычитала статью прошлой ночью.'],
    ['I have proofread the whole chapter.', 'Я вычитал всю главу.'],
  ),
  rid: t(
    ['I want to rid the kitchen of ants.', 'Хочу избавить кухню от муравьёв.'],
    ['They rid the garden of weeds.', 'Они избавили сад от сорняков.'],
    ['We have rid the house of mice.', 'Мы избавили дом от мышей.'],
  ),
  shed: t(
    ['Snakes shed their skin.', 'Змеи сбрасывают кожу.'],
    ['The tree shed its leaves.', 'Дерево сбросило листья.'],
    ['He has shed a few tears.', 'Он пролил несколько слёз.'],
  ),
  slit: t(
    ['I slit the envelope with a knife.', 'Я вскрываю конверт ножом.'],
    ['She slit the fabric carefully.', 'Она аккуратно разрезала ткань.'],
    ['He has slit the bag open.', 'Он уже разрезал пакет.'],
  ),
  thrust: t(
    ['Do not thrust the box at me.', 'Не пихай мне коробку.'],
    ['He thrust the key into the lock.', 'Он вставил ключ в замок.'],
    ['She has thrust the papers into the bag.', 'Она запихнула бумаги в сумку.'],
  ),
  wed: t(
    ['They wed in a small church.', 'Они венчаются в маленькой церкви.'],
    ['They wed last June.', 'Они поженились в июне.'],
    ['The couple has wed in secret.', 'Пара тайно поженилась.'],
  ),
  wet: t(
    ['Rain wets the streets quickly.', 'Дождь быстро мочит улицы.'],
    ['He wet the cloth under the tap.', 'Он намочил тряпку под краном.'],
    ['I have wet my sleeves again.', 'Я снова намочил рукава.'],
  ),
  shrink: t(
    ['Wool jumpers shrink in hot water.', 'Шерстяные свитеры садятся в горячей воде.'],
    ['The sweater shrank in the wash.', 'Свитер сел после стирки.'],
    ['The company has shrunk this year.', 'Компания в этом году сократилась.'],
  ),
  spring: t(
    ['Cats spring onto the sofa.', 'Кошки запрыгивают на диван.'],
    ['He sprang out of bed.', 'Он вскочил с кровати.'],
    ['A leak has sprung in the pipe.', 'В трубе появилась течь.'],
  ),
  stink: t(
    ['The fridge stinks if we forget food.', 'Холодильник воняет, если забыть еду.'],
    ['The kitchen stank of fish.', 'На кухне воняло рыбой.'],
    ['The bin has stunk all day.', 'Ведро воняет весь день.'],
  ),
  behold: t(
    ['Behold the view from here.', 'Взгляни на вид отсюда.'],
    ['We beheld the mountains at dawn.', 'На рассвете мы увидели горы.'],
    ['I have beheld nothing like it.', 'Я никогда такого не видел.'],
  ),
  bind: t(
    ['They bind the books by hand.', 'Они переплетают книги вручную.'],
    ['She bound the papers with string.', 'Она связала бумаги верёвкой.'],
    ['The contract has bound both sides.', 'Договор связал обе стороны.'],
  ),
  bleed: t(
    ['My finger bleeds a little.', 'Палец немного кровит.'],
    ['His nose bled after the fall.', 'После падения у него пошла кровь из носа.'],
    ['The cut has bled for an hour.', 'Рана кровит уже час.'],
  ),
  breed: t(
    ['They breed horses on this farm.', 'На этой ферме разводят лошадей.'],
    ['The zoo bred two cubs last year.', 'В прошлом году в зоопарке родились два детёныша.'],
    ['They have bred this type for years.', 'Они разводят эту породу много лет.'],
  ),
  cling: t(
    ['The child clings to her mother.', 'Ребёнок цепляется за маму.'],
    ['Wet clothes clung to my skin.', 'Мокрая одежда прилипла к коже.'],
    ['Ivy has clung to the wall.', 'Плющ обхватил стену.'],
  ),
  creep: t(
    ['Fog creeps over the fields.', 'Туман ползёт по полям.'],
    ['He crept into the room.', 'Он прокрался в комнату.'],
    ['Doubt has crept into my mind.', 'В голову закралось сомнение.'],
  ),
  dwell: t(
    ['They dwell in a small village.', 'Они живут в маленькой деревне.'],
    ['He dwelt on the mistake too long.', 'Он слишком долго зацикливался на ошибке.'],
    ['She has dwelt here all her life.', 'Она прожила здесь всю жизнь.'],
  ),
  fling: t(
    ['Do not fling your bag on the floor.', 'Не швыряй сумку на пол.'],
    ['He flung the window open.', 'Он распахнул окно.'],
    ['She has flung the letter away.', 'Она выбросила письмо.'],
  ),
  grind: t(
    ['I grind coffee every morning.', 'Я мелю кофе каждое утро.'],
    ['She ground the spices by hand.', 'Она смолола специи вручную.'],
    ['I have ground enough pepper.', 'Я уже намолол достаточно перца.'],
  ),
  kneel: t(
    ['People kneel to tie their shoes.', 'Люди становятся на колени, чтобы завязать шнурки.'],
    ['He knelt beside the box.', 'Он опустился на колени рядом с коробкой.'],
    ['She has knelt on the cold floor.', 'Она стояла на коленях на холодном полу.'],
  ),
  lean: t(
    ['Do not lean on the wet paint.', 'Не опирайся на свежую краску.'],
    ['He leant against the wall.', 'Он прислонился к стене.'],
    ['I have leant on you too much.', 'Я слишком на тебя опирался.'],
  ),
  leap: t(
    ['Deer leap over the fence.', 'Олени перепрыгивают через забор.'],
    ['She leapt onto the platform.', 'Она вспрыгнула на платформу.'],
    ['Prices have leapt this month.', 'Цены в этом месяце резко подскочили.'],
  ),
  rewind: t(
    ['Please rewind the tape.', 'Перемотай кассету, пожалуйста.'],
    ['He rewound the film to the start.', 'Он перемотал фильм на начало.'],
    ['I have rewound it twice.', 'Я уже дважды перематывал.'],
  ),
  sling: t(
    ['He slings the bag over his shoulder.', 'Он вешает сумку через плечо.'],
    ['She slung her coat on the chair.', 'Она бросила пальто на стул.'],
    ['He has slung the rope across the gap.', 'Он перекинул верёвку через проём.'],
  ),
  sneak: t(
    ['The cat sneaks into the kitchen.', 'Кот крадётся на кухню.'],
    ['He snuck out after dinner.', 'Он тайком вышел после ужина.'],
    ['I have snuck a look at the answers.', 'Я украдкой глянул на ответы.'],
  ),
  speed: t(
    ['Cars speed down this road.', 'По этой дороге машины мчатся.'],
    ['The ambulance sped to the hospital.', 'Скорая помчалась в больницу.'],
    ['Time has sped by this week.', 'На этой неделе время пролетело.'],
  ),
  spin: t(
    ['The Earth spins around its axis.', 'Земля вращается вокруг своей оси.'],
    ['She spun around in surprise.', 'Она резко обернулась от удивления.'],
    ['The wheel has spun for a minute.', 'Колесо крутится уже минуту.'],
  ),
  spit: t(
    ['Please do not spit on the ground.', 'Пожалуйста, не плюй на землю.'],
    ['The camel spat at the tourist.', 'Верблюд плюнул в туриста.'],
    ['The kettle has spat hot water.', 'Чайник брызнул кипятком.'],
  ),
  string: t(
    ['I string the lights on the tree.', 'Я развешиваю гирлянду на ёлке.'],
    ['She strung the beads on a thread.', 'Она нанизала бусины на нитку.'],
    ['We have strung the banners already.', 'Мы уже повесили флаги.'],
  ),
  uphold: t(
    ['Judges uphold the law.', 'Судьи поддерживают закон.'],
    ['The court upheld the decision.', 'Суд оставил решение в силе.'],
    ['They have upheld this rule for years.', 'Они много лет держатся этого правила.'],
  ),
  weep: t(
    ['Some people weep at sad films.', 'Некоторые плачут на грустных фильмах.'],
    ['She wept when she heard the news.', 'Она заплакала, когда услышала новость.'],
    ['He has wept enough today.', 'Он сегодня уже наплакался.'],
  ),
  wind: t(
    ['I wind the clock every Sunday.', 'Каждое воскресенье я завожу часы.'],
    ['She wound the scarf around her neck.', 'Она обмотала шарф вокруг шеи.'],
    ['I have wound the cable neatly.', 'Я аккуратно смотал кабель.'],
  ),
  withhold: t(
    ['Do not withhold the truth.', 'Не скрывай правду.'],
    ['They withheld the payment.', 'Они удержали выплату.'],
    ['He has withheld important facts.', 'Он скрыл важные факты.'],
  ),
  withstand: t(
    ['This coat withstands heavy rain.', 'Это пальто выдерживает сильный дождь.'],
    ['The bridge withstood the storm.', 'Мост выдержал шторм.'],
    ['The team has withstood a lot of pressure.', 'Команда выдержала большое давление.'],
  ),
  wring: t(
    ['Wring the cloth before you wipe.', 'Выжми тряпку, прежде чем протирать.'],
    ['She wrung the wet shirt.', 'Она выжала мокрую рубашку.'],
    ['I have wrung all the water out.', 'Я выжал всю воду.'],
  ),
  arise: t(
    ['Problems arise when we rush.', 'Проблемы возникают, когда мы спешим.'],
    ['A new issue arose yesterday.', 'Вчера возник новый вопрос.'],
    ['Several doubts have arisen.', 'Появилось несколько сомнений.'],
  ),
  awake: t(
    ['I awake at the first light.', 'Я просыпаюсь с первым светом.'],
    ['She awoke to the alarm.', 'Она проснулась от будильника.'],
    ['I have awoken with a headache.', 'Я проснулся с головной болью.'],
  ),
  forsake: t(
    ['Do not forsake your friends.', 'Не бросай друзей.'],
    ['He forsook the old plan.', 'Он отказался от старого плана.'],
    ['She has not forsaken her dream.', 'Она не оставила свою мечту.'],
  ),
  partake: t(
    ['Guests partake in the meal.', 'Гости участвуют в трапезе.'],
    ['We partook of the cake.', 'Мы отведали торт.'],
    ['I have partaken in this tradition.', 'Я участвовал в этой традиции.'],
  ),
  retake: t(
    ['I retake the test next week.', 'На следующей неделе я пересдаю тест.'],
    ['She retook the exam in June.', 'Она пересдала экзамен в июне.'],
    ['He has retaken the photo twice.', 'Он уже дважды переснимал фото.'],
  ),
  shear: t(
    ['Farmers shear sheep in spring.', 'Весной фермеры стригут овец.'],
    ['They shore the flock yesterday.', 'Вчера они постригли отару.'],
    ['The sheep have been shorn already.', 'Овец уже постригли.'],
  ),
  strive: t(
    ['I strive to speak clearly.', 'Я стараюсь говорить ясно.'],
    ['She strove to finish on time.', 'Она стремилась закончить вовремя.'],
    ['We have striven for a fair result.', 'Мы добивались честного результата.'],
  ),
  thrive: t(
    ['Plants thrive in this light.', 'В этом свете растения хорошо растут.'],
    ['The shop throve last summer.', 'Прошлым летом магазин процветал.'],
    ['The business has thriven online.', 'Бизнес хорошо пошёл в сети.'],
  ),
  undertake: t(
    ['We undertake this work together.', 'Мы берёмся за эту работу вместе.'],
    ['She undertook a long trip.', 'Она предприняла долгую поездку.'],
    ['They have undertaken a new project.', 'Они взялись за новый проект.'],
  ),
  weave: t(
    ['She weaves baskets from straw.', 'Она плетёт корзины из соломы.'],
    ['They wove a colourful rug.', 'Они соткали яркий ковёр.'],
    ['This cloth has been woven by hand.', 'Эта ткань соткана вручную.'],
  ),
  broadcast: t(
    ['They broadcast the news at six.', 'Они передают новости в шесть.'],
    ['The radio broadcast the match live.', 'Радио транслировало матч в прямом эфире.'],
    ['The show has been broadcast twice.', 'Шоу уже транслировали дважды.'],
  ),
  fit: t(
    ['These shoes fit me well.', 'Эти туфли мне как раз.'],
    ['The key fit the lock.', 'Ключ подошёл к замку.'],
    ['Nothing has fit so well before.', 'Ничто раньше так не сидело.'],
  ),
  input: t(
    ['Please input your password.', 'Введите пароль.'],
    ['She input the data yesterday.', 'Она ввела данные вчера.'],
    ['I have input all the names.', 'Я ввёл все имена.'],
  ),
  quit: t(
    ['I quit sugar in tea.', 'Я бросаю сахар в чае.'],
    ['He quit the job last month.', 'Он уволился в прошлом месяце.'],
    ['She has quit smoking.', 'Она бросила курить.'],
  ),
  shut: t(
    ['Please shut the window.', 'Закрой окно, пожалуйста.'],
    ['He shut the door behind him.', 'Он закрыл за собой дверь.'],
    ['The shop has shut for the day.', 'Магазин уже закрылся на сегодня.'],
  ),
  split: t(
    ['We split the bill equally.', 'Мы делим счёт поровну.'],
    ['The log split in two.', 'Полено раскололось надвое.'],
    ['They have split the group into pairs.', 'Они разделили группу на пары.'],
  ),
  spread: t(
    ['I spread butter on the bread.', 'Я намазываю масло на хлеб.'],
    ['The news spread quickly.', 'Новость быстро разошлась.'],
    ['The stain has spread on the shirt.', 'Пятно расползлось по рубашке.'],
  ),
  upset: t(
    ['Loud noise upsets the dog.', 'Громкий шум расстраивает собаку.'],
    ['The news upset everyone.', 'Новость всех расстроила.'],
    ['I have upset the glass again.', 'Я снова опрокинул стакан.'],
  ),
  ring: t(
    ['The phone rings every morning.', 'Телефон звонит каждое утро.'],
    ['Someone rang the doorbell.', 'Кто-то позвонил в дверь.'],
    ['I have rung you twice today.', 'Я звонил тебе сегодня дважды.'],
  ),
  sink: t(
    ['Heavy stones sink in water.', 'Тяжёлые камни тонут в воде.'],
    ['The boat sank near the shore.', 'Лодка затонула у берега.'],
    ['The sun has sunk behind the hills.', 'Солнце село за холмами.'],
  ),
  bend: t(
    ['Bend your knees a little.', 'Слегка согни колени.'],
    ['He bent the wire in half.', 'Он согнул провод пополам.'],
    ['The road has bent to the left.', 'Дорога завернула налево.'],
  ),
  burn: t(
    ['Dry wood burns well.', 'Сухое дерево хорошо горит.'],
    ['She burnt the toast.', 'Она сожгла тост.'],
    ['The candle has burnt down.', 'Свеча догорела.'],
  ),
  deal: t(
    ['I deal with emails after lunch.', 'После обеда я разбираю письма.'],
    ['She dealt the cards quickly.', 'Она быстро раздала карты.'],
    ['We have dealt with this problem before.', 'Мы уже сталкивались с этой проблемой.'],
  ),
  dig: t(
    ['They dig a hole for the tree.', 'Они копают яму для дерева.'],
    ['The dog dug under the fence.', 'Собака копала под забором.'],
    ['We have dug the whole garden.', 'Мы перекопали весь огород.'],
  ),
  dream: t(
    ['I often dream about the sea.', 'Я часто вижу во сне море.'],
    ['She dreamt of a long trip.', 'Ей снилась долгая поездка.'],
    ['I have dreamt about this house.', 'Мне уже снился этот дом.'],
  ),
  feed: t(
    ['I feed the cat twice a day.', 'Я кормлю кота дважды в день.'],
    ['He fed the ducks in the park.', 'Он покормил уток в парке.'],
    ['I have fed the baby already.', 'Я уже покормил малыша.'],
  ),
  fight: t(
    ['They fight for a fair deal.', 'Они борются за честные условия.'],
    ['The two teams fought hard.', 'Обе команды сражались упорно.'],
    ['We have fought this battle before.', 'Мы уже вели эту борьбу.'],
  ),
  hang: t(
    ['I hang my coat by the door.', 'Я вешаю пальто у двери.'],
    ['She hung the picture on the wall.', 'Она повесила картину на стену.'],
    ['The keys have hung here for years.', 'Ключи висят здесь уже много лет.'],
  ),
  lay: t(
    ['I lay the book on the desk.', 'Я кладу книгу на стол.'],
    ['She laid the map on the table.', 'Она положила карту на стол.'],
    ['They have laid a new carpet.', 'Они постелили новый ковёр.'],
  ),
  lend: t(
    ['Can you lend me a pen?', 'Можешь одолжить мне ручку?'],
    ['He lent me his charger.', 'Он одолжил мне зарядку.'],
    ['I have lent her my notes.', 'Я одолжил ей свои конспекты.'],
  ),
  light: t(
    ['I light a candle in the evening.', 'Вечером я зажигаю свечу.'],
    ['She lit the stove.', 'Она зажгла плиту.'],
    ['Someone has lit a fire outside.', 'Снаружи уже разожгли костёр.'],
  ),
  seek: t(
    ['We seek a quiet place to work.', 'Мы ищем тихое место для работы.'],
    ['She sought help from a teacher.', 'Она обратилась за помощью к учителю.'],
    ['I have sought an answer all day.', 'Я весь день искал ответ.'],
  ),
  shine: t(
    ['The sun shines after the rain.', 'После дождя светит солнце.'],
    ['Her shoes shone in the hall.', 'Её туфли блестели в холле.'],
    ['The stars have shone all night.', 'Звёзды светили всю ночь.'],
  ),
  shoot: t(
    ['They shoot the scene at dawn.', 'Они снимают сцену на рассвете.'],
    ['He shot the ball into the net.', 'Он забросил мяч в сетку.'],
    ['The team has shot three films here.', 'Команда сняла здесь три фильма.'],
  ),
  slide: t(
    ['Kids slide down the hill.', 'Дети съезжают с горки.'],
    ['The glass slid off the table.', 'Стакан соскользнул со стола.'],
    ['The door has slid open.', 'Дверь уже отодвинулась.'],
  ),
  smell: t(
    ['I smell coffee from the kitchen.', 'Я чувствую запах кофе с кухни.'],
    ['The soup smelt wonderful.', 'Суп пах замечательно.'],
    ['I have smelt this perfume before.', 'Я уже чувствовал эти духи.'],
  ),
  spell: t(
    ['How do you spell your name?', 'Как пишется твоё имя?'],
    ['She spelt the word correctly.', 'Она правильно написала слово по буквам.'],
    ['I have spelt it wrong again.', 'Я снова написал его неправильно.'],
  ),
  spill: t(
    ['Do not spill the tea.', 'Не пролей чай.'],
    ['He spilt juice on the sofa.', 'Он пролил сок на диван.'],
    ['Someone has spilt milk here.', 'Кто-то пролил здесь молоко.'],
  ),
  spoil: t(
    ['Heat spoils the milk.', 'Жара портит молоко.'],
    ['The rain spoilt our picnic.', 'Дождь испортил пикник.'],
    ['The fruit has spoilt in the bag.', 'Фрукты в сумке испортились.'],
  ),
  stick: t(
    ['The stamp will not stick.', 'Марка не клеится.'],
    ['The key stuck in the lock.', 'Ключ застрял в замке.'],
    ['Mud has stuck to my shoes.', 'Грязь прилипла к ботинкам.'],
  ),
  sting: t(
    ['Bees sting if you disturb them.', 'Пчёлы жалят, если их потревожить.'],
    ['A wasp stung my arm.', 'Оса ужалила меня в руку.'],
    ['The smoke has stung my eyes.', 'Дым защипал глаза.'],
  ),
  strike: t(
    ['The clock strikes twelve.', 'Часы бьют двенадцать.'],
    ['Lightning struck the tree.', 'Молния ударила в дерево.'],
    ['A new idea has struck me.', 'Меня осенила новая мысль.'],
  ),
  sweep: t(
    ['I sweep the kitchen after dinner.', 'После ужина я подметаю кухню.'],
    ['She swept the leaves off the path.', 'Она смела листья с дорожки.'],
    ['He has swept the whole floor.', 'Он подмёл весь пол.'],
  ),
  swing: t(
    ['Kids swing in the playground.', 'Дети качаются на площадке.'],
    ['The door swung shut.', 'Дверь захлопнулась.'],
    ['Moods have swung all week.', 'Настроение всю неделю скачет.'],
  ),
  bear: t(
    ['I cannot bear this noise.', 'Я не выношу этот шум.'],
    ['She bore the news calmly.', 'Она спокойно приняла новость.'],
    ['This plan was born last year.', 'Этот план родился в прошлом году.'],
  ),
  beat: t(
    ['I beat the eggs with a fork.', 'Я взбиваю яйца вилкой.'],
    ['Our team beat them 3–0.', 'Наша команда обыграла их 3:0.'],
    ['He has beaten this level twice.', 'Он уже дважды проходил этот уровень.'],
  ),
  bite: t(
    ['The dog never bites.', 'Эта собака никогда не кусается.'],
    ['She bit into the apple.', 'Она откусила яблоко.'],
    ['A mosquito has bitten my arm.', 'Меня укусил комар.'],
  ),
  blow: t(
    ['The wind blows from the sea.', 'Ветер дует с моря.'],
    ['He blew out the candles.', 'Он задул свечи.'],
    ['The storm has blown the fence down.', 'Шторм повалил забор.'],
  ),
  dive: t(
    ['Kids dive into the pool.', 'Дети прыгают в бассейн.'],
    ['She dove into the water.', 'Она нырнула в воду.'],
    ['He has dived from this rock before.', 'Он уже нырял с этой скалы.'],
  ),
  draw: t(
    ['I draw maps in my notebook.', 'Я рисую карты в тетради.'],
    ['She drew a cat on the board.', 'Она нарисовала кота на доске.'],
    ['I have drawn this street before.', 'Я уже рисовал эту улицу.'],
  ),
  forbid: t(
    ['The rules forbid phones in class.', 'Правила запрещают телефоны на уроке.'],
    ['Dad forbade us to swim there.', 'Папа запретил нам там плавать.'],
    ['Smoking has been forbidden here.', 'Курить здесь запрещено.'],
  ),
  forgive: t(
    ['I forgive small mistakes.', 'Я прощаю мелкие ошибки.'],
    ['She forgave him at once.', 'Она сразу его простила.'],
    ['I have forgiven that remark.', 'Я простил то замечание.'],
  ),
  freeze: t(
    ['Water freezes at zero.', 'Вода замерзает при нуле.'],
    ['The lake froze last night.', 'Озеро замёрзло прошлой ночью.'],
    ['I have frozen the leftover soup.', 'Я заморозил оставшийся суп.'],
  ),
  hide: t(
    ['I hide the gifts in the closet.', 'Я прячу подарки в шкафу.'],
    ['He hid behind the sofa.', 'Он спрятался за диваном.'],
    ['She has hidden the keys again.', 'Она снова спрятала ключи.'],
  ),
  lie: t(
    ['I lie on the sofa after work.', 'После работы я лежу на диване.'],
    ['The cat lay in the sun.', 'Кот лежал на солнце.'],
    ['I have lain awake for hours.', 'Я часами лежал без сна.'],
  ),
  mistake: t(
    ['People often mistake us for twins.', 'Нас часто принимают за близнецов.'],
    ['I mistook the date.', 'Я перепутал дату.'],
    ['I have mistaken the address.', 'Я ошибся адресом.'],
  ),
  overtake: t(
    ['Do not overtake on this bend.', 'Не обгоняй на этом повороте.'],
    ['A lorry overtook us on the motorway.', 'Грузовик обогнал нас на трассе.'],
    ['She has overtaken the leader.', 'Она обогнала лидера.'],
  ),
  rewrite: t(
    ['I rewrite the draft in the evening.', 'Вечером я переписываю черновик.'],
    ['She rewrote the first paragraph.', 'Она переписала первый абзац.'],
    ['I have rewritten the whole essay.', 'Я переписал всё сочинение.'],
  ),
  rise: t(
    ['The sun rises early in June.', 'В июне солнце встаёт рано.'],
    ['Prices rose last month.', 'В прошлом месяце цены выросли.'],
    ['The river has risen after the rain.', 'После дождя река поднялась.'],
  ),
  shake: t(
    ['Shake the bottle before you open it.', 'Потряси бутылку, прежде чем открывать.'],
    ['He shook my hand.', 'Он пожал мне руку.'],
    ['The news has shaken everyone.', 'Новость всех потрясла.'],
  ),
  steal: t(
    ['Thieves steal bikes from this yard.', 'Из этого двора крадут велосипеды.'],
    ['Someone stole my scarf.', 'Кто-то украл мой шарф.'],
    ['The painting has been stolen.', 'Картину украли.'],
  ),
  swear: t(
    ['I swear I locked the door.', 'Клянусь, я закрыл дверь.'],
    ['He swore to tell the truth.', 'Он поклялся говорить правду.'],
    ['I have sworn never to do that.', 'Я поклялся больше так не делать.'],
  ),
  tear: t(
    ['Do not tear the page.', 'Не рви страницу.'],
    ['She tore the letter in half.', 'Она разорвала письмо пополам.'],
    ['I have torn my jeans again.', 'Я снова порвал джинсы.'],
  ),
  withdraw: t(
    ['I withdraw cash from this ATM.', 'Я снимаю наличные в этом банкомате.'],
    ['She withdrew from the contest.', 'Она снялась с конкурса.'],
    ['He has withdrawn all his savings.', 'Он снял все сбережения.'],
  ),
  overcome: t(
    ['We overcome fear step by step.', 'Мы преодолеваем страх шаг за шагом.'],
    ['She overcame her shyness.', 'Она преодолела стеснительность.'],
    ['They have overcome many problems.', 'Они преодолели много проблем.'],
  ),
  undergo: t(
    ['Patients undergo tests in the morning.', 'Пациенты проходят анализы утром.'],
    ['He underwent surgery last year.', 'В прошлом году он перенёс операцию.'],
    ['The office has undergone a renovation.', 'Офис прошёл ремонт.'],
  ),
}

export const LISTED_INFINITIVES = Object.keys(LIST_EXAMPLES)
