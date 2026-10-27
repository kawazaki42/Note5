<Qucs Schematic 26.1.1>
<Properties>
  <View=-18,60,1555,1038,1,0,0>
  <Grid=10,10,1>
  <DataSet=1.dat>
  <DataDisplay=1.dpl>
  <OpenDisplay=0>
  <Script=1.m>
  <RunScript=0>
  <showFrame=0>
  <FrameText0=Title>
  <FrameText1=Drawn By:>
  <FrameText2=Date:>
  <FrameText3=Revision:>
</Properties>
<Symbol>
</Symbol>
<Components>
  <R R1 1 380 200 15 -26 0 1 "10 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "european" 0>
  <R R2 1 380 400 15 -26 0 1 "980 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "european" 0>
  <GND * 1 130 550 0 0 0 0>
  <VProbe Pr1 1 570 170 -16 28 0 3>
  <VProbe Pr2 1 570 400 -16 28 0 3>
  <.DC DC1 1 770 180 0 34 0 0 "26.85" 0 "0.001" 0 "1 pA" 0 "1 uV" 0 "no" 0 "150" 0 "no" 0 "none" 0 "CroutLU" 0>
  <Vdc V1 1 130 240 18 -26 0 1 "5 V" 1>
  <IProbe Pr3 1 380 290 -41 -26 0 3>
  <IProbe Pr4 1 380 460 -41 -26 0 3>
</Components>
<Wires>
  <130 270 130 550 "" 0 0 0 "">
  <380 340 380 370 "" 0 0 0 "">
  <130 90 380 90 "" 0 0 0 "">
  <380 340 550 340 "" 0 0 0 "">
  <380 90 550 90 "" 0 0 0 "">
  <550 90 550 160 "" 0 0 0 "">
  <380 90 380 170 "" 0 0 0 "">
  <550 340 550 390 "" 0 0 0 "">
  <130 550 380 550 "" 0 0 0 "">
  <130 90 130 210 "" 0 0 0 "">
  <550 410 550 550 "" 0 0 0 "">
  <550 180 550 340 "" 0 0 0 "">
  <380 320 380 340 "" 0 0 0 "">
  <380 490 380 550 "" 0 0 0 "">
  <380 550 550 550 "" 0 0 0 "">
  <380 230 380 260 "" 0 0 0 "">
  <380 230 380 220 "" 0 0 0 "">
</Wires>
<Diagrams>
  <Tab 750 414 417 74 3 #c0c0c0 1 00 1 0 1 1 1 0 1 1 1 0 1 1 315 0 225 1 0 0 "" "" "">
	<"ngspice/v(pr1)" #0000ff 0 3 0 0 0>
	<"ngspice/v(pr2)" #0000ff 0 3 0 0 0>
	<"ngspice/i(pr3)" #0000ff 0 3 1 0 0>
	<"ngspice/i(pr4)" #0000ff 0 3 1 0 0>
  </Tab>
  <Time 750 632 395 172 3 #c0c0c0 1 00 1 0 1 1 1 0 1 1 1 0 1 1 315 0 225 1 0 0 "" "" "">
	<"ngspice/v(pr1)" #0000ff 1 3 0 0 0>
	<"ngspice/v(pr2)" #ff0000 1 3 0 0 0>
	<"ngspice/i(pr3)" #ff00ff 1 3 0 0 0>
	<"ngspice/i(pr4)" #00ff00 1 3 0 0 0>
  </Time>
</Diagrams>
<Paintings>
</Paintings>
