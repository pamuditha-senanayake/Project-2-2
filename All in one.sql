PGDMP                      |            secrets    15.8    16.4 :    D           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            E           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            F           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            G           1262    16415    secrets    DATABASE     �   CREATE DATABASE secrets WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE secrets;
                postgres    false            �            1259    16477    appointment_services    TABLE     s   CREATE TABLE public.appointment_services (
    appointment_id integer NOT NULL,
    service_id integer NOT NULL
);
 (   DROP TABLE public.appointment_services;
       public         heap    postgres    false            �            1259    16512    appointment_time_slots    TABLE     v   CREATE TABLE public.appointment_time_slots (
    appointment_id integer NOT NULL,
    time_number integer NOT NULL
);
 *   DROP TABLE public.appointment_time_slots;
       public         heap    postgres    false            �            1259    16460    appointments    TABLE     Z  CREATE TABLE public.appointments (
    id integer NOT NULL,
    user_id integer,
    professional_id integer,
    appointment_date date NOT NULL,
    total_time interval,
    total_cost numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(10) DEFAULT ''::character varying NOT NULL
);
     DROP TABLE public.appointments;
       public         heap    postgres    false            �            1259    16459    appointments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.appointments_id_seq;
       public          postgres    false    225            H           0    0    appointments_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;
          public          postgres    false    224            �            1259    16433 	   employees    TABLE     �   CREATE TABLE public.employees (
    id integer NOT NULL,
    name character varying(45),
    employee_code character varying(45),
    salary integer
);
    DROP TABLE public.employees;
       public         heap    postgres    false            �            1259    16432    employees_id_seq    SEQUENCE     �   CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.employees_id_seq;
       public          postgres    false    219            I           0    0    employees_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;
          public          postgres    false    218            �            1259    16416    hours    TABLE     }   CREATE TABLE public.hours (
    id integer NOT NULL,
    uid integer,
    hours integer,
    place character varying(100)
);
    DROP TABLE public.hours;
       public         heap    postgres    false            �            1259    16419    hours_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.hours_id_seq;
       public          postgres    false    214            J           0    0    hours_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.hours_id_seq OWNED BY public.hours.id;
          public          postgres    false    215            �            1259    16451    professionals    TABLE     �   CREATE TABLE public.professionals (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    specialty character varying(100),
    description text
);
 !   DROP TABLE public.professionals;
       public         heap    postgres    false            �            1259    16450    professionals_id_seq    SEQUENCE     �   CREATE SEQUENCE public.professionals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.professionals_id_seq;
       public          postgres    false    223            K           0    0    professionals_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.professionals_id_seq OWNED BY public.professionals.id;
          public          postgres    false    222            �            1259    16444    services    TABLE     �   CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    price numeric(10,2) NOT NULL,
    duration interval NOT NULL
);
    DROP TABLE public.services;
       public         heap    postgres    false            �            1259    16443    services_id_seq    SEQUENCE     �   CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.services_id_seq;
       public          postgres    false    221            L           0    0    services_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;
          public          postgres    false    220            �            1259    16420    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100),
    name character varying(255) DEFAULT ''::character varying NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16423    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216            M           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    217            �           2604    16463    appointments id    DEFAULT     r   ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);
 >   ALTER TABLE public.appointments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224    225            �           2604    16436    employees id    DEFAULT     l   ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);
 ;   ALTER TABLE public.employees ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    16424    hours id    DEFAULT     d   ALTER TABLE ONLY public.hours ALTER COLUMN id SET DEFAULT nextval('public.hours_id_seq'::regclass);
 7   ALTER TABLE public.hours ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            �           2604    16454    professionals id    DEFAULT     t   ALTER TABLE ONLY public.professionals ALTER COLUMN id SET DEFAULT nextval('public.professionals_id_seq'::regclass);
 ?   ALTER TABLE public.professionals ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    16447    services id    DEFAULT     j   ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);
 :   ALTER TABLE public.services ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    16425    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216            @          0    16477    appointment_services 
   TABLE DATA           J   COPY public.appointment_services (appointment_id, service_id) FROM stdin;
    public          postgres    false    226   �B       A          0    16512    appointment_time_slots 
   TABLE DATA           M   COPY public.appointment_time_slots (appointment_id, time_number) FROM stdin;
    public          postgres    false    227   �C       ?          0    16460    appointments 
   TABLE DATA           �   COPY public.appointments (id, user_id, professional_id, appointment_date, total_time, total_cost, created_at, status) FROM stdin;
    public          postgres    false    225   �D       9          0    16433 	   employees 
   TABLE DATA           D   COPY public.employees (id, name, employee_code, salary) FROM stdin;
    public          postgres    false    219   �G       4          0    16416    hours 
   TABLE DATA           6   COPY public.hours (id, uid, hours, place) FROM stdin;
    public          postgres    false    214   CH       =          0    16451    professionals 
   TABLE DATA           I   COPY public.professionals (id, name, specialty, description) FROM stdin;
    public          postgres    false    223   �H       ;          0    16444    services 
   TABLE DATA           =   COPY public.services (id, name, price, duration) FROM stdin;
    public          postgres    false    221   RJ       6          0    16420    users 
   TABLE DATA           :   COPY public.users (id, email, password, name) FROM stdin;
    public          postgres    false    216   
K       N           0    0    appointments_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.appointments_id_seq', 62, true);
          public          postgres    false    224            O           0    0    employees_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.employees_id_seq', 7, true);
          public          postgres    false    218            P           0    0    hours_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.hours_id_seq', 18, true);
          public          postgres    false    215            Q           0    0    professionals_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.professionals_id_seq', 5, true);
          public          postgres    false    222            R           0    0    services_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.services_id_seq', 9, true);
          public          postgres    false    220            S           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 11, true);
          public          postgres    false    217            �           2606    16481 .   appointment_services appointment_services_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.appointment_services
    ADD CONSTRAINT appointment_services_pkey PRIMARY KEY (appointment_id, service_id);
 X   ALTER TABLE ONLY public.appointment_services DROP CONSTRAINT appointment_services_pkey;
       public            postgres    false    226    226            �           2606    16516 2   appointment_time_slots appointment_time_slots_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.appointment_time_slots
    ADD CONSTRAINT appointment_time_slots_pkey PRIMARY KEY (appointment_id, time_number);
 \   ALTER TABLE ONLY public.appointment_time_slots DROP CONSTRAINT appointment_time_slots_pkey;
       public            postgres    false    227    227            �           2606    16466    appointments appointments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_pkey;
       public            postgres    false    225            �           2606    16438    employees employees_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public            postgres    false    219            �           2606    16427    hours hours_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.hours
    ADD CONSTRAINT hours_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.hours DROP CONSTRAINT hours_pkey;
       public            postgres    false    214            �           2606    16458     professionals professionals_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.professionals DROP CONSTRAINT professionals_pkey;
       public            postgres    false    223            �           2606    16449    services services_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.services DROP CONSTRAINT services_pkey;
       public            postgres    false    221            �           2606    16429    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    216            �           2606    16431    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           2606    16482 =   appointment_services appointment_services_appointment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointment_services
    ADD CONSTRAINT appointment_services_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;
 g   ALTER TABLE ONLY public.appointment_services DROP CONSTRAINT appointment_services_appointment_id_fkey;
       public          postgres    false    3228    226    225            �           2606    16487 9   appointment_services appointment_services_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointment_services
    ADD CONSTRAINT appointment_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.appointment_services DROP CONSTRAINT appointment_services_service_id_fkey;
       public          postgres    false    226    221    3224            �           2606    16517 A   appointment_time_slots appointment_time_slots_appointment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointment_time_slots
    ADD CONSTRAINT appointment_time_slots_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;
 k   ALTER TABLE ONLY public.appointment_time_slots DROP CONSTRAINT appointment_time_slots_appointment_id_fkey;
       public          postgres    false    225    227    3228            �           2606    16472 .   appointments appointments_professional_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals(id);
 X   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_professional_id_fkey;
       public          postgres    false    223    3226    225            �           2606    16467 &   appointments appointments_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 P   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_user_id_fkey;
       public          postgres    false    225    216    3220            @   �   x�%��1�G1�������>;l�|=n�� 2w�#)��B&2�9�̋^�+z5�c�l��P]�K��b�g�OՃ ���\p,0o���������@l���|��L�4��!<DT�T����H�D6�Md�D6+����kz�j�-ɖ�fL�=/��XrA�A?�(1J���[J��|+�۫��{������1���C�      A   �   x�%�ۑE!��l� >r��Ǳ��t18R�i�_�i�@2��Ld!Y���@ Lѽ���&�5��8%@hQ�WM��D����;��a!z��T�*�>eP0(xiL,�²�l,#��37�����jx�4���ԫ��������k��� yA.�Ež5܊�"�H)�(>�6���6Ƿ����M>��gf�$�>A      ?   Z  x���[��FE��UxӨwWsY���� �F�ߦ4�Z�Pf �:ݷ�5<�$������d!�{b����G����E�4�r�s�Ţ\�7�z�o�R�<�4�IXi��=y��4ٙ�j��a��	4n��`�ZI3e��<	ׅj	�t�n'���,����X��(�C���j�%�I�82��"Gئ:�G�#:oū4	�>������B�����/�&�cV\�m�-gu��u���uqYDaz�B��K}��Z!�H�m�!ޮ�k��@��RI)6�i-�w�=���Ujmp����% �DHd���W�#�hi�77�=Mw��瀣�y���蛄��4杶9��ﰜ�9��>$�8�����|���R7�3�Ѝ�$v��;e�ئ�.��6T=����w��Ƴb-)П�6���ø�'<��,��<���_/�!�z�*���f݇�ø�8�fR��"�gÎ�y��iQ�h�vo�g�#'�J�et����v�W�NF]��k�g��,U�z�i=��IKR6Di�<�{�>�g�m��C�q c�V�6J���'Kb�٘ut�6�8^˽U�>VM�Nw��ܧ�:�����O~/��e��(�f�kL��}���m��Vm�)Η��y�執?���������x�q�k����}�m'�v�I��.4�u�#�h�]>��gj�j���������5�u��k�������Q:ʱ�=�}s^c�}_(u�|+g<G�̺���m�1�|��cz��Uν�qʚ:��2-�V�<p��Z��=���pN�\���ݶ�����8�JU4��!��ĵ��x=[�fI	�ƴ�	�N��׺�a�a����ǟ�<�?`<g9      9   ?   x�3��M�K�,�t�04��45500�2�tI-�L��s��9RKR����Ɯ�`�=... B�^      4   A   x�3�4�4��N�K��2Ebp�rq&����&�s�rM9̀p�9�c�i��r�b���� ��      =   �  x�U�ێ�0��ۧ�P�`�AX�RW�O�N�I�8�[�'$�2>����u���W�1K� 'u��;���8�"�޲�h�8	�@��ȿ�ƕc�?�k�K����d���9�lM�΃LQ��M�	/<�w��s�����k�����4�r��<�z�%�{a� 3PUm�͕�ث�(��:Q��%�����,?9T
?�<����x�L�͋5�F��`b)٤YaIԂ+M�C���<�oQ�c�j�&�6��l�.��п�FY=#|H�fT�TV�7F�1�L9������v ���RC�h�pk��~��z0�g�+��LE����EԒ��HX����;�`\lUwȆW��n����P��e��g���?B��
O5|=m�K��[T�z���)��3�oc�γY�8�[[8������_{       ;   �   x�]�A�0E��Sp2-�m�B#.�L��&PL��%5!������p���Wt �"5 $b��K�阀�]�� [����薾��#����R�Sm��ꚆN��_�圑p"k��i��~��κ�ؼ��o�����Dn�9Tz�H�U/,|�z��u�c?V�B      6   �   x�m�Mn�0���)|+NUw��MV�n�L�Qb�=�毷Ǵ�u������3�d
z^������ÁR�HL�@��Z	��`G�u��8���S�G	����]�1@�����$�;�����0�ѓu_��~�@]un����BSd,����<o�Ӑ%��\�Qdt+�#��6�3h���D�YV�(��O`���
���FF�	�o�8r     