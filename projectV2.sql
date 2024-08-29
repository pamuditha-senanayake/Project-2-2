--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 16.4

-- Started on 2024-08-29 16:04:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16433)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    name character varying(45),
    employee_code character varying(45),
    salary integer
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16432)
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- TOC entry 3347 (class 0 OID 0)
-- Dependencies: 218
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- TOC entry 214 (class 1259 OID 16416)
-- Name: hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hours (
    id integer NOT NULL,
    uid integer,
    hours integer,
    place character varying(100)
);


ALTER TABLE public.hours OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16419)
-- Name: hours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hours_id_seq OWNER TO postgres;

--
-- TOC entry 3348 (class 0 OID 0)
-- Dependencies: 215
-- Name: hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hours_id_seq OWNED BY public.hours.id;


--
-- TOC entry 216 (class 1259 OID 16420)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16423)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3349 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3185 (class 2604 OID 16436)
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- TOC entry 3183 (class 2604 OID 16424)
-- Name: hours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hours ALTER COLUMN id SET DEFAULT nextval('public.hours_id_seq'::regclass);


--
-- TOC entry 3184 (class 2604 OID 16425)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3341 (class 0 OID 16433)
-- Dependencies: 219
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, name, employee_code, salary) FROM stdin;
3	John	EMP125	85000
4	Devid	EMP127	95000
5	Mendis	EMP129	55000
6	Wood	EMP131	155000
\.


--
-- TOC entry 3336 (class 0 OID 16416)
-- Dependencies: 214
-- Data for Name: hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hours (id, uid, hours, place) FROM stdin;
4	1	4	kandy
5	1	4	kandy
10	5	2	colombo
11	5	2	colombo
15	6	5	colombo
17	5	3	kandy
16	6	3	kandy 
\.


--
-- TOC entry 3338 (class 0 OID 16420)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password) FROM stdin;
1	1@gmail.com	1
3	2@gmail.com	2
4	3@gmail.com	3
5	4@gmail.com	$2b$10$Q5l11aMfJStv3Hr1WnPboOWrvhA/dLWJwFx.N8ezxZ/GWuYA7oLx2
6	pamudithasenanayake@gmail.com	google
7	10@gmail.com	$2b$10$57nZtcmAHreYPO9UL6k4zO4pVTC/aECL//sSfJbP5yoF9CleeUh9.
\.


--
-- TOC entry 3350 (class 0 OID 0)
-- Dependencies: 218
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 6, true);


--
-- TOC entry 3351 (class 0 OID 0)
-- Dependencies: 215
-- Name: hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hours_id_seq', 18, true);


--
-- TOC entry 3352 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 3193 (class 2606 OID 16438)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 3187 (class 2606 OID 16427)
-- Name: hours hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hours
    ADD CONSTRAINT hours_pkey PRIMARY KEY (id);


--
-- TOC entry 3189 (class 2606 OID 16429)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3191 (class 2606 OID 16431)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2024-08-29 16:04:20

--
-- PostgreSQL database dump complete
--

