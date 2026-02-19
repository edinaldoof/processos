import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, Treemap, ComposedChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ReferenceLine
} from "recharts";
import {
  FileText, TrendingUp, Users, Clock, AlertTriangle, BarChart3, ArrowUpRight,
  ArrowDownRight, Activity, Building2, Zap, CheckCircle2, XCircle, Timer,
  ChevronRight, Layers, GitBranch, Award, Calendar, ArrowRight, Flame, Target
} from "lucide-react";

const fmt = (n) => n?.toLocaleString("pt-BR") ?? "—";
const fmtPct = (n) => `${n?.toFixed(1)?.replace(".", ",")}%`;

// ─── COLOR PALETTE ─────────────────────────────────────────────────
const C = {
  navy: "#0B1D3A",
  navyLight: "#132D54",
  blue: "#1E5AA8",
  blueLight: "#2E7DD1",
  bluePale: "#4A9AE8",
  teal: "#0E9AA7",
  tealLight: "#3CC7C7",
  green: "#2ECC71",
  greenDark: "#27AE60",
  amber: "#F39C12",
  red: "#E74C3C",
  redDark: "#C0392B",
  gray100: "#F8FAFD",
  gray200: "#EDF1F7",
  gray300: "#D5DDE8",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#475569",
  gray700: "#334155",
  white: "#FFFFFF",
  cardBg: "rgba(255,255,255,0.65)",
};
const CHART_COLORS = [C.blue, C.teal, C.amber, C.green, C.blueLight, C.red, "#8B5CF6", "#EC4899"];

// ─── DATA ───────────────────────────────────────────────────────────
const kpis2025 = [
  { label: "Processos Criados", value: 67932, icon: FileText, color: C.blue, sub: "+106,9% vs 2024" },
  { label: "Tramitações", value: 127237, icon: Activity, color: C.teal, sub: "+152,1% vs 2024" },
  { label: "Finalizados", value: 13696, icon: CheckCircle2, color: C.green, sub: "Taxa: 20,2%" },
  { label: "Em Andamento", value: 40536, icon: Clock, color: C.amber, sub: "59,7% do total" },
  { label: "Média Tram/Proc", value: "2,02", icon: Layers, color: C.blueLight, sub: "micro processos", raw: true },
  { label: "Tempo Médio (dias)", value: "151,2", icon: Timer, color: C.gray500, sub: "-61,9% vs 2024", raw: true },
];

const anual = [
  { ano: "2018", processos: 12066, tramitacoes: 11184, finalizados: 0, mediaTram: 1.40, tempoMedio: 2776.5, usuarios: 17, setores: 12 },
  { ano: "2019", processos: 11147, tramitacoes: 11302, finalizados: 0, mediaTram: 1.53, tempoMedio: 2413.4, usuarios: 24, setores: 18 },
  { ano: "2020", processos: 7166, tramitacoes: 8751, finalizados: 0, mediaTram: 1.87, tempoMedio: 2069.9, usuarios: 28, setores: 24 },
  { ano: "2021", processos: 8244, tramitacoes: 9320, finalizados: 0, mediaTram: 1.69, tempoMedio: 1677.7, usuarios: 28, setores: 16 },
  { ano: "2022", processos: 11831, tramitacoes: 13667, finalizados: 0, mediaTram: 1.70, tempoMedio: 1305.6, usuarios: 16, setores: 14 },
  { ano: "2023", processos: 16004, tramitacoes: 19603, finalizados: 0, mediaTram: 1.72, tempoMedio: 939.2, usuarios: 22, setores: 15 },
  { ano: "2024", processos: 32833, tramitacoes: 50472, finalizados: 7245, mediaTram: 2.12, tempoMedio: 397.9, usuarios: 46, setores: 18 },
  { ano: "2025", processos: 67932, tramitacoes: 127237, finalizados: 14444, mediaTram: 1.77, tempoMedio: 151.3, usuarios: 55, setores: 16 },
  { ano: "2026*", processos: 8275, tramitacoes: 12237, finalizados: 1571, mediaTram: 1.50, tempoMedio: 19.8, usuarios: 43, setores: 9 },
];

const variacao = [
  { periodo: "2018→2019", processos: -7.6, tramitacoes: 1.1, finalizados: null, usuarios: 41.2 },
  { periodo: "2019→2020", processos: -35.7, tramitacoes: -22.6, finalizados: null, usuarios: 16.7 },
  { periodo: "2020→2021", processos: 15.0, tramitacoes: 6.5, finalizados: null, usuarios: 0.0 },
  { periodo: "2021→2022", processos: 43.5, tramitacoes: 46.6, finalizados: null, usuarios: -42.9 },
  { periodo: "2022→2023", processos: 35.3, tramitacoes: 43.4, finalizados: null, usuarios: 37.5 },
  { periodo: "2023→2024", processos: 105.2, tramitacoes: 157.5, finalizados: null, usuarios: 109.1 },
  { periodo: "2024→2025", processos: 106.9, tramitacoes: 152.1, finalizados: 99.4, usuarios: 19.6 },
];

const mensal2025 = [
  { mes: "Jan", processos: 2804, tramitacoes: 5348, finalizados: 2038 },
  { mes: "Fev", processos: 3487, tramitacoes: 4671, finalizados: 518 },
  { mes: "Mar", processos: 3951, tramitacoes: 6135, finalizados: 1541 },
  { mes: "Abr", processos: 4701, tramitacoes: 28106, finalizados: 1726 },
  { mes: "Mai", processos: 5426, tramitacoes: 8186, finalizados: 915 },
  { mes: "Jun", processos: 6638, tramitacoes: 10120, finalizados: 631 },
  { mes: "Jul", processos: 6493, tramitacoes: 11855, finalizados: 1759 },
  { mes: "Ago", processos: 5893, tramitacoes: 9229, finalizados: 915 },
  { mes: "Set", processos: 6846, tramitacoes: 10276, finalizados: 1041 },
  { mes: "Out", processos: 7921, tramitacoes: 12601, finalizados: 1259 },
  { mes: "Nov", processos: 6931, tramitacoes: 11028, finalizados: 1007 },
  { mes: "Dez", processos: 6841, tramitacoes: 9682, finalizados: 1150 },
];

const assuntos = [
  { assunto: "LOTE DE PAGAMENTOS", processos: 13699, tram: 0, fin: 0, andamento: 13699, tempo: 210 },
  { assunto: "33.90.18 - BOLSA", processos: 7580, tram: 12297, fin: 29, andamento: 7551, tempo: 186 },
  { assunto: "BOLSAS PESQUISADOR", processos: 7509, tram: 11965, fin: 170, andamento: 7339, tempo: 191 },
  { assunto: "33.90.14 - DIÁRIAS", processos: 5834, tram: 10184, fin: 268, andamento: 5566, tempo: 195 },
  { assunto: "SOLIC. PGTO BOLSA", processos: 5649, tram: 14304, fin: 3219, andamento: 2430, tempo: 75 },
  { assunto: "33.90.20 - BOLSAS PESQ.", processos: 4349, tram: 6897, fin: 76, andamento: 4273, tempo: 202 },
  { assunto: "SOLIC. PGTO DIÁRIAS", processos: 4239, tram: 10705, fin: 2424, andamento: 1815, tempo: 68 },
  { assunto: "BOLSA", processos: 4137, tram: 6884, fin: 27, andamento: 4110, tempo: 208 },
  { assunto: "RELATÓRIO DE VIAGEM", processos: 2801, tram: 2806, fin: 2791, andamento: 10, tempo: 1 },
  { assunto: "33.90.39 - SERV. PJ", processos: 1116, tram: 4599, fin: 365, andamento: 751, tempo: 148 },
];

const setores = [
  { setor: "GER. PROJETOS", colab: 19, mov: 49034, andamento: 19578, fin: 0, tempo: 36.2, movColab: 2581 },
  { setor: "GER. FINANÇAS", colab: 11, mov: 33191, andamento: 33719, fin: 0, tempo: 84, movColab: 3017 },
  { setor: "ARQUIVO", colab: 2, mov: 14537, andamento: 0, fin: 23060, tempo: 55.7, movColab: 7269 },
  { setor: "ARQ. FINANCEIRO", colab: 0, mov: 10022, andamento: 0, fin: 9753, tempo: 6, movColab: null },
  { setor: "ARQ. GER. PROJETOS", colab: 0, mov: 9890, andamento: 0, fin: 9761, tempo: 62.5, movColab: null },
  { setor: "GER. ADMINISTRATIVA", colab: 13, mov: 7318, andamento: 3172, fin: 0, tempo: 66.5, movColab: 563 },
  { setor: "ARQ. ADMINISTRATIVO", colab: 0, mov: 1760, andamento: 0, fin: 1681, tempo: 63.6, movColab: null },
  { setor: "ASSESSORIA TÉC./JUR.", colab: 3, mov: 1085, andamento: 133, fin: 0, tempo: 50.8, movColab: 362 },
];

const gargalos = [
  { setor: "GER. FINANÇAS E CONTAB.", carga: 33719, parados: 33454, tipo: "VOLUME CRÍTICO", sev: 3 },
  { setor: "GER. PROJETOS", carga: 19578, parados: 18844, tipo: "VOLUME CRÍTICO", sev: 3 },
  { setor: "GER. ADMINISTRATIVA", carga: 3172, parados: 3060, tipo: "LENTIDÃO", sev: 3 },
  { setor: "SETOR 0", carga: 1380, parados: 1369, tipo: "ESTAGNAÇÃO", sev: 3 },
  { setor: "RECEPÇÃO", carga: 491, parados: 491, tipo: "LENTIDÃO", sev: 3 },
];

const heatmapData = {
  dias: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
  horas: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  valores: [
    [70, 1015, 1735, 2237, 2540, 1625, 2365, 2853, 3814, 9560, 7310, 1968, 521, 279],
    [138, 890, 2185, 2969, 3024, 2092, 1464, 2586, 2307, 2852, 2146, 458, 225, 253],
    [66, 1071, 2839, 2823, 2968, 1954, 1848, 2494, 1881, 2050, 1512, 477, 279, 349],
    [76, 1032, 1869, 2567, 2173, 1359, 1182, 2043, 2140, 1777, 1151, 335, 281, 107],
    [125, 916, 1807, 2419, 2316, 1440, 1702, 1744, 2182, 2236, 1321, 400, 72, 54],
    [52, 14, 53, 184, 218, 291, 66, 58, 27, 38, 73, 22, 27, 70],
    [7, 55, 71, 137, 69, 67, 80, 46, 87, 53, 65, 71, 93, 91],
  ],
};

const fluxo = [
  { origem: "Criação (Setor 200)", destino: "GER. PROJETOS", total: 33464 },
  { origem: "GER. PROJETOS", destino: "GER. FINANÇAS", total: 28933 },
  { origem: "SECRETARIA", destino: "GER. PROJETOS", total: 11528 },
  { origem: "GER. FINANÇAS", destino: "ARQUIVO", total: 10395 },
  { origem: "GER. FINANÇAS", destino: "ARQ. FINANCEIRO", total: 9968 },
  { origem: "GER. PROJETOS", destino: "ARQ. GER. PROJETOS", total: 9767 },
  { origem: "GER. ADMINISTRATIVA", destino: "GER. FINANÇAS", total: 3026 },
  { origem: "GER. PROJETOS", destino: "GER. ADMINISTRATIVA", total: 2978 },
  { origem: "GER. FINANÇAS", destino: "GER. ADMINISTRATIVA", total: 2879 },
  { origem: "SECRETARIA", destino: "ARQUIVO", total: 2745 },
];

const projetos = [
  { conv: "0", proj: "Sem Projeto Vinculado", proc: 14049, tram: 377, fin: 9, and: 14040 },
  { conv: "3265015", proj: "MULHERES MIL - CICLO 3/2024", proc: 3453, tram: 6575, fin: 242, and: 3211 },
  { conv: "3183679", proj: "PROJETO TEKO PORÃ", proc: 3234, tram: 5852, fin: 402, and: 2832 },
  { conv: "3008647", proj: "GESTÃO TERRITORIAL QUILOMBOLA", proc: 2416, tram: 4331, fin: 513, and: 1903 },
  { conv: "3212948", proj: "MULHERES MIL CICLO 3 - IFSERTÃO", proc: 2078, tram: 3452, fin: 84, and: 1994 },
  { conv: "2978744", proj: "SOFTEX - IFMA - P&D&I em TIC", proc: 1827, tram: 2460, fin: 47, and: 1780 },
  { conv: "3136900", proj: "COMBATE À DESERTIFICAÇÃO", proc: 1780, tram: 3139, fin: 669, and: 1111 },
  { conv: "1999435", proj: "EJA INTEGRADA - EPT UFPI", proc: 1731, tram: 3714, fin: 992, and: 739 },
  { conv: "3271301", proj: "SEMINÁRIOS TERRITÓRIOS ANCESTRAIS", proc: 1601, tram: 2592, fin: 96, and: 1505 },
  { conv: "2509747", proj: "PARFOR ETAPA 2022", proc: 1409, tram: 3547, fin: 629, and: 780 },
];

const colaboradores = [
  { nome: "CRISLANNE", setor: "SECRETARIA", env: 15165, rec: 0, media: 41.5, posse: 0 },
  { nome: "BRUNA RAQUEL VALERIO", setor: "GER. PROJETOS", env: 8443, rec: 7483, media: 23.1, posse: 392 },
  { nome: "NAYDSON DOS SANTOS", setor: "GER. FINANÇAS", env: 7129, rec: 1745, media: 19.5, posse: 589 },
  { nome: "LUANA SILVA", setor: "GER. PROJETOS", env: 6894, rec: 9, media: 18.9, posse: 0 },
  { nome: "CLAUDIANE SOUSA", setor: "GER. PROJETOS", env: 6652, rec: 5613, media: 18.2, posse: 246 },
  { nome: "MISAEL DE CARVALHO", setor: "GER. PROJETOS", env: 5997, rec: 5380, media: 16.4, posse: 6 },
  { nome: "SAMUEL DA S. NOLETO", setor: "GER. FINANÇAS", env: 4856, rec: 217, media: 13.3, posse: 41 },
  { nome: "JULIETE PEREIRA", setor: "GER. PROJETOS", env: 3537, rec: 2502, media: 9.7, posse: 8 },
  { nome: "LIVIA CRAVEIRO", setor: "GER. PROJETOS", env: 3114, rec: 2427, media: 8.5, posse: 145 },
  { nome: "MATUSALA RODRIGUES", setor: "GER. PROJETOS", env: 2794, rec: 2436, media: 7.7, posse: 77 },
];

const faixaTempo = [
  { faixa: "Até 5d", qtd: 3597, pct: 6.63 },
  { faixa: "6-15d", qtd: 4454, pct: 8.21 },
  { faixa: "16-30d", qtd: 2511, pct: 4.63 },
  { faixa: "31-60d", qtd: 2544, pct: 4.69 },
  { faixa: "61-90d", qtd: 5591, pct: 10.31 },
  { faixa: "91-180d", qtd: 14459, pct: 26.66 },
  { faixa: "181-365d", qtd: 19522, pct: 36.00 },
  { faixa: ">365d", qtd: 1555, pct: 2.87 },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.navy, border: `1px solid ${C.blue}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
      <p style={{ color: C.gray300, fontSize: 12, marginBottom: 4, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, margin: "2px 0" }}>
          {p.name}: <strong>{fmt(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

const Card = ({ children, className = "", style = {} }) => (
  <div style={{
    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 24,
    ...style,
  }} className={className}>
    {children}
  </div>
);

const KPICard = ({ item }) => {
  const Icon = item.icon;
  return (
    <Card style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${item.color}15` }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={22} color={item.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 4 }}>{item.label}</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: C.white, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {item.raw ? item.value : fmt(item.value)}
          </p>
          <p style={{ fontSize: 11, color: C.gray400, marginTop: 4 }}>{item.sub}</p>
        </div>
      </div>
    </Card>
  );
};

const SeverityBadge = ({ sev, tipo }) => {
  const colors = { 3: C.red, 2: C.amber, 1: C.green };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: `${colors[sev]}20`, color: colors[sev], border: `1px solid ${colors[sev]}40`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors[sev] }} />
      {tipo}
    </span>
  );
};

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
    borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
    transition: "all 0.2s ease", whiteSpace: "nowrap",
    background: active ? `linear-gradient(135deg, ${C.blue}, ${C.teal})` : "rgba(255,255,255,0.05)",
    color: active ? C.white : C.gray400,
    boxShadow: active ? `0 4px 16px ${C.blue}40` : "none",
  }}>
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

const SectionTitle = ({ icon: Icon, children, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      {Icon && <Icon size={22} color={C.teal} />}
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>{children}</h2>
    </div>
    {sub && <p style={{ fontSize: 13, color: C.gray400, marginLeft: Icon ? 32 : 0 }}>{sub}</p>}
  </div>
);

const MiniTable = ({ headers, rows, maxHeight }) => (
  <div style={{ overflowX: "auto", overflowY: maxHeight ? "auto" : undefined, maxHeight, borderRadius: 12, border: `1px solid rgba(255,255,255,0.08)` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: "12px 14px", textAlign: h.align || "left", color: C.gray300,
              fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em",
              background: "rgba(255,255,255,0.04)", borderBottom: `1px solid rgba(255,255,255,0.08)`,
              whiteSpace: "nowrap", position: "sticky", top: 0,
            }}>{h.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "10px 14px", color: C.gray200, textAlign: headers[j]?.align || "left", whiteSpace: "nowrap" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── SECTIONS ───────────────────────────────────────────────────────

const VisaoGeral = () => (
  <div>
    <SectionTitle icon={Target} sub="Resumo executivo da performance operacional da FADEX em 2025">
      Visão Geral 2025
    </SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
      {kpis2025.map((k, i) => <KPICard key={i} item={k} />)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Distribuição de Processos por Status</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={[
              { name: "Em Andamento", value: 40536 },
              { name: "Finalizados", value: 13696 },
              { name: "Outros", value: 13700 },
            ]} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {[C.amber, C.green, C.gray500].map((c, i) => <Cell key={i} fill={c} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: C.gray400 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Faixa de Tempo das Tramitações</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={faixaTempo} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="faixa" tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="qtd" name="Quantidade" fill={C.blue} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
    <Card style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>📊 Destaques e Insights 2025</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {[
          { cat: "CRESCIMENTO", txt: "Processos +106,9%", sub: "De 32.833 para 67.932", icon: TrendingUp, c: C.green },
          { cat: "CRESCIMENTO", txt: "Tramitações +152,1%", sub: "De 50.472 para 127.237", icon: ArrowUpRight, c: C.teal },
          { cat: "PRODUTIVIDADE", txt: "CRISLANNE — Top 1", sub: "15.165 tramitações no ano", icon: Award, c: C.amber },
          { cat: "GARGALO", txt: "FINANÇAS — 33.454 parados", sub: "Mais de 7 dias sem movimentação", icon: AlertTriangle, c: C.red },
          { cat: "PICO", txt: "Segunda-feira às 16h", sub: "Maior concentração de atividade", icon: Zap, c: C.blueLight },
          { cat: "EFICIÊNCIA", txt: "Taxa de conclusão: 20,2%", sub: "13.696 finalizados de 67.932", icon: Target, c: C.gray400 },
        ].map((ins, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: 14,
            borderRadius: 12, background: `${ins.c}08`, border: `1px solid ${ins.c}20`,
          }}>
            <ins.icon size={18} color={ins.c} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 10, color: ins.c, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{ins.cat}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.white, marginTop: 2 }}>{ins.txt}</p>
              <p style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>{ins.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const Historico = () => (
  <div>
    <SectionTitle icon={TrendingUp} sub="Comparativo anual de 2018 a 2026 (parcial)">
      Evolução Histórica
    </SectionTitle>
    <Card style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Processos e Tramitações por Ano</h3>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={anual}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="ano" tick={{ fill: C.gray400, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="processos" name="Processos" fill={C.blue} radius={[4, 4, 0, 0]} barSize={32} />
          <Bar dataKey="tramitacoes" name="Tramitações" fill={C.teal} radius={[4, 4, 0, 0]} barSize={32} />
          <Line dataKey="finalizados" name="Finalizados" stroke={C.green} strokeWidth={2.5} dot={{ r: 4, fill: C.green }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Tempo Médio de Tramitação (dias)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={anual}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="ano" tick={{ fill: C.gray400, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="tempoMedio" name="Tempo Médio (dias)" stroke={C.amber} strokeWidth={2.5} dot={{ r: 5, fill: C.amber }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Usuários e Setores Ativos</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={anual}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="ano" tick={{ fill: C.gray400, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="usuarios" name="Usuários" fill={C.blueLight} radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="setores" name="Setores" fill={C.gray500} radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
    <Card style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Variação Anual (%)</h3>
      <MiniTable
        headers={[
          { label: "Período" }, { label: "Processos", align: "right" },
          { label: "Tramitações", align: "right" }, { label: "Finalizados", align: "right" },
          { label: "Usuários", align: "right" },
        ]}
        rows={variacao.map(v => [
          v.periodo,
          <span style={{ color: v.processos >= 0 ? C.green : C.red, fontWeight: 600 }}>
            {v.processos >= 0 ? "+" : ""}{v.processos.toFixed(1).replace(".", ",")}%
          </span>,
          <span style={{ color: v.tramitacoes >= 0 ? C.green : C.red, fontWeight: 600 }}>
            {v.tramitacoes >= 0 ? "+" : ""}{v.tramitacoes.toFixed(1).replace(".", ",")}%
          </span>,
          v.finalizados != null
            ? <span style={{ color: C.green, fontWeight: 600 }}>+{v.finalizados.toFixed(1).replace(".", ",")}%</span>
            : <span style={{ color: C.gray500 }}>N/A</span>,
          <span style={{ color: v.usuarios >= 0 ? C.green : C.red, fontWeight: 600 }}>
            {v.usuarios >= 0 ? "+" : ""}{v.usuarios.toFixed(1).replace(".", ",")}%
          </span>,
        ])}
      />
    </Card>
  </div>
);

const Mensal = () => (
  <div>
    <SectionTitle icon={Calendar} sub="Evolução mês a mês de processos, tramitações e finalizados">
      Análise Mensal 2025
    </SectionTitle>
    <Card style={{ marginBottom: 20 }}>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={mensal2025}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="mes" tick={{ fill: C.gray400, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area dataKey="tramitacoes" name="Tramitações" fill={`${C.teal}20`} stroke={C.teal} strokeWidth={2} />
          <Bar dataKey="processos" name="Processos" fill={C.blue} radius={[4, 4, 0, 0]} barSize={28} />
          <Line dataKey="finalizados" name="Finalizados" stroke={C.green} strokeWidth={2.5} dot={{ r: 4, fill: C.green }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
    <Card>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Dados Mensais Detalhados</h3>
      <MiniTable
        headers={[
          { label: "Mês" }, { label: "Processos", align: "right" },
          { label: "Tramitações", align: "right" }, { label: "Finalizados", align: "right" },
          { label: "Taxa Conclusão", align: "right" },
        ]}
        rows={mensal2025.map(m => [
          m.mes, fmt(m.processos), fmt(m.tramitacoes), fmt(m.finalizados),
          fmtPct((m.finalizados / m.processos) * 100),
        ])}
      />
    </Card>
  </div>
);

const Setores_ = () => (
  <div>
    <SectionTitle icon={Building2} sub="Performance e carga de trabalho por setor">
      Ranking de Setores
    </SectionTitle>
    <Card style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Movimentações por Setor</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={setores} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <YAxis dataKey="setor" type="category" tick={{ fill: C.gray300, fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="andamento" name="Em Andamento" fill={C.amber} stackId="s" radius={[0, 0, 0, 0]} />
          <Bar dataKey="fin" name="Finalizados" fill={C.green} stackId="s" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
    <Card>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Detalhamento por Setor</h3>
      <MiniTable
        headers={[
          { label: "Setor" }, { label: "Colab.", align: "right" }, { label: "Movimentações", align: "right" },
          { label: "Em Andamento", align: "right" }, { label: "Finalizados", align: "right" },
          { label: "Tempo Médio", align: "right" }, { label: "Mov/Colab", align: "right" },
        ]}
        rows={setores.map(s => [
          s.setor, s.colab, fmt(s.mov), fmt(s.andamento), fmt(s.fin),
          `${s.tempo.toFixed(1).replace(".", ",")} d`,
          s.movColab ? fmt(s.movColab) : "—",
        ])}
      />
    </Card>
  </div>
);

const Gargalos_ = () => (
  <div>
    <SectionTitle icon={AlertTriangle} sub="Setores com maior volume de processos parados (>7 dias)">
      Gargalos Operacionais
    </SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 20 }}>
      {gargalos.map((g, i) => (
        <Card key={i} style={{ borderLeft: `4px solid ${C.red}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{g.setor}</h4>
            <SeverityBadge sev={g.sev} tipo={g.tipo} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: C.gray400, textTransform: "uppercase" }}>Carga Atual</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: C.amber }}>{fmt(g.carga)}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.gray400, textTransform: "uppercase" }}>Parados &gt;7d</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: C.red }}>{fmt(g.parados)}</p>
            </div>
          </div>
          <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${C.red}, ${C.amber})`, width: `${(g.parados / g.carga) * 100}%` }} />
          </div>
          <p style={{ fontSize: 11, color: C.gray400, marginTop: 6, textAlign: "right" }}>
            {((g.parados / g.carga) * 100).toFixed(1).replace(".", ",")}% parados
          </p>
        </Card>
      ))}
    </div>
    <Card>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Comparativo de Carga por Setor</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={gargalos}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="setor" tick={{ fill: C.gray400, fontSize: 10 }} axisLine={false} tickLine={false} angle={-15} />
          <YAxis tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="carga" name="Carga Total" fill={C.amber} radius={[4, 4, 0, 0]} barSize={36} />
          <Bar dataKey="parados" name="Parados >7d" fill={C.red} radius={[4, 4, 0, 0]} barSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

const Heatmap = () => {
  const maxVal = Math.max(...heatmapData.valores.flat());
  const getColor = (val) => {
    const ratio = val / maxVal;
    if (ratio < 0.05) return "rgba(14,154,167,0.08)";
    if (ratio < 0.15) return "rgba(14,154,167,0.2)";
    if (ratio < 0.3) return "rgba(14,154,167,0.4)";
    if (ratio < 0.5) return "rgba(30,90,168,0.6)";
    if (ratio < 0.7) return "rgba(30,90,168,0.8)";
    if (ratio < 0.85) return "rgba(231,76,60,0.7)";
    return "rgba(231,76,60,0.95)";
  };
  return (
    <div>
      <SectionTitle icon={Flame} sub="Distribuição de atividade por dia da semana e hora do dia">
        Mapa de Calor — Atividade Semanal
      </SectionTitle>
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 3, minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ padding: 8, fontSize: 11, color: C.gray400, textAlign: "left", fontWeight: 600 }}>Dia / Hora</th>
                {heatmapData.horas.map(h => (
                  <th key={h} style={{ padding: "8px 4px", fontSize: 11, color: C.gray400, textAlign: "center", fontWeight: 500 }}>{h}h</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.dias.map((dia, di) => (
                <tr key={dia}>
                  <td style={{ padding: "8px 12px", fontSize: 12, color: C.gray300, fontWeight: 500, whiteSpace: "nowrap" }}>{dia}</td>
                  {heatmapData.valores[di].map((val, hi) => (
                    <td key={hi} style={{
                      padding: 0, textAlign: "center", position: "relative",
                    }}>
                      <div style={{
                        background: getColor(val), borderRadius: 6,
                        padding: "10px 4px", fontSize: 10, color: val > maxVal * 0.3 ? C.white : C.gray400,
                        fontWeight: val > maxVal * 0.5 ? 700 : 400,
                        minWidth: 36, transition: "transform 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                        {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, justifyContent: "center" }}>
          <span style={{ fontSize: 11, color: C.gray400 }}>Baixo</span>
          {[0.05, 0.15, 0.3, 0.5, 0.7, 0.85, 1].map((r, i) => (
            <div key={i} style={{ width: 28, height: 14, borderRadius: 4, background: getColor(r * maxVal) }} />
          ))}
          <span style={{ fontSize: 11, color: C.gray400 }}>Alto</span>
        </div>
      </Card>
    </div>
  );
};

const Fluxo_ = () => {
  const maxFlux = Math.max(...fluxo.map(f => f.total));
  return (
    <div>
      <SectionTitle icon={GitBranch} sub="Principais fluxos de movimentação entre setores">
        Fluxo entre Setores
      </SectionTitle>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fluxo.map((f, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "180px 30px 180px 1fr 90px", alignItems: "center", gap: 8,
              padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <span style={{ fontSize: 12, color: C.bluePale, fontWeight: 600, textAlign: "right" }}>{f.origem}</span>
              <ArrowRight size={16} color={C.gray500} />
              <span style={{ fontSize: 12, color: C.tealLight, fontWeight: 600 }}>{f.destino}</span>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4, transition: "width 0.5s",
                  background: `linear-gradient(90deg, ${C.blue}, ${C.teal})`,
                  width: `${(f.total / maxFlux) * 100}%`,
                }} />
              </div>
              <span style={{ fontSize: 13, color: C.white, fontWeight: 700, textAlign: "right" }}>{fmt(f.total)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const AssuntosProjetos = () => (
  <div>
    <SectionTitle icon={Layers} sub="Top 10 assuntos e projetos por volume de processos">
      Assuntos e Projetos
    </SectionTitle>
    <Card style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Top 10 Assuntos</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={assuntos} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <YAxis dataKey="assunto" type="category" tick={{ fill: C.gray300, fontSize: 10 }} axisLine={false} tickLine={false} width={150} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="processos" name="Processos" fill={C.blue} radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
    <Card>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Top 10 Projetos (por volume)</h3>
      <MiniTable
        maxHeight={400}
        headers={[
          { label: "#", align: "center" }, { label: "Projeto" }, { label: "Processos", align: "right" },
          { label: "Tramitações", align: "right" }, { label: "Finalizados", align: "right" },
          { label: "Em Andamento", align: "right" },
        ]}
        rows={projetos.map((p, i) => [
          <span style={{ fontWeight: 700, color: i < 3 ? C.amber : C.gray400 }}>{i + 1}</span>,
          <span style={{ fontSize: 12 }}>{p.proj}</span>,
          fmt(p.proc), fmt(p.tram), fmt(p.fin), fmt(p.and),
        ])}
      />
    </Card>
  </div>
);

const Colaboradores_ = () => (
  <div>
    <SectionTitle icon={Users} sub="Ranking dos 10 colaboradores com maior volume de tramitações">
      Top 10 Colaboradores
    </SectionTitle>
    <Card style={{ marginBottom: 20 }}>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={colaboradores} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" tick={{ fill: C.gray400, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <YAxis dataKey="nome" type="category" tick={{ fill: C.gray300, fontSize: 10 }} axisLine={false} tickLine={false} width={150} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="env" name="Enviadas" fill={C.blue} stackId="s" barSize={18} />
          <Bar dataKey="rec" name="Recebidas" fill={C.teal} stackId="s" radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
    <Card>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.gray300, marginBottom: 16 }}>Detalhamento</h3>
      <MiniTable
        headers={[
          { label: "#", align: "center" }, { label: "Colaborador" }, { label: "Setor" },
          { label: "Enviadas", align: "right" }, { label: "Recebidas", align: "right" },
          { label: "Média/Dia", align: "right" }, { label: "Em Posse", align: "right" },
        ]}
        rows={colaboradores.map((c, i) => [
          <span style={{ fontWeight: 700, color: i === 0 ? C.amber : i < 3 ? C.bluePale : C.gray400, fontSize: 14 }}>{i + 1}</span>,
          <span style={{ fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.amber : C.white }}>{c.nome}</span>,
          <span style={{ fontSize: 11, color: C.gray400 }}>{c.setor}</span>,
          fmt(c.env), fmt(c.rec),
          c.media.toFixed(1).replace(".", ","),
          fmt(c.posse),
        ])}
      />
    </Card>
  </div>
);

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────

const tabs = [
  { id: "visao", label: "Visão Geral", icon: Target },
  { id: "historico", label: "Histórico", icon: TrendingUp },
  { id: "mensal", label: "Mensal 2025", icon: Calendar },
  { id: "setores", label: "Setores", icon: Building2 },
  { id: "gargalos", label: "Gargalos", icon: AlertTriangle },
  { id: "heatmap", label: "Heatmap", icon: Flame },
  { id: "fluxo", label: "Fluxo", icon: GitBranch },
  { id: "assuntos", label: "Assuntos", icon: Layers },
  { id: "colaboradores", label: "Colaboradores", icon: Users },
];

const sections = {
  visao: VisaoGeral,
  historico: Historico,
  mensal: Mensal,
  setores: Setores_,
  gargalos: Gargalos_,
  heatmap: Heatmap,
  fluxo: Fluxo_,
  assuntos: AssuntosProjetos,
  colaboradores: Colaboradores_,
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("visao");
  const Section = sections[activeTab];

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${C.navy} 0%, #0A1628 40%, #0D1F3C 70%, #081420 100%)`,
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      color: C.white,
    }}>
      {/* Background pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,29,58,0.85)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 32px",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 16px ${C.blue}40`,
            }}>
              <BarChart3 size={22} color={C.white} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                FADEX — Análise de Protocolos <span style={{ color: C.teal }}>2025</span>
              </h1>
              <p style={{ fontSize: 12, color: C.gray400 }}>Fundação Cultural e de Fomento à Pesquisa, Ensino, Extensão e Inovação</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, color: C.gray500, padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Relatório gerado em 19/02/2026
            </span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{
        position: "sticky", top: 74, zIndex: 40,
        background: "rgba(11,29,58,0.7)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "12px 32px",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {tabs.map(t => (
            <TabButton key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} icon={t.icon}>
              {t.label}
            </TabButton>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ position: "relative", zIndex: 10, maxWidth: 1400, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Section />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 32px",
        textAlign: "center", fontSize: 11, color: C.gray500,
      }}>
        FADEX — Departamento de Tecnologia da Informação · Dados extraídos do sistema SAGI · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
