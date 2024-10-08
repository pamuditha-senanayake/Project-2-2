PGDMP     7    :                |            secrets    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    17616    secrets    DATABASE     i   CREATE DATABASE secrets WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE secrets;
                postgres    false            �            1259    17630    hours    TABLE     }   CREATE TABLE public.hours (
    id integer NOT NULL,
    uid integer,
    hours integer,
    place character varying(100)
);
    DROP TABLE public.hours;
       public         heap    postgres    false            �            1259    17629    hours_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.hours_id_seq;
       public          postgres    false    217                       0    0    hours_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.hours_id_seq OWNED BY public.hours.id;
          public          postgres    false    216            �            1259    17618    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100)
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    17617    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    215                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    214            u           2604    17633    hours id    DEFAULT     d   ALTER TABLE ONLY public.hours ALTER COLUMN id SET DEFAULT nextval('public.hours_id_seq'::regclass);
 7   ALTER TABLE public.hours ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217            t           2604    17621    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215                      0    17630    hours 
   TABLE DATA           6   COPY public.hours (id, uid, hours, place) FROM stdin;
    public          postgres    false    217   [                 0    17618    users 
   TABLE DATA           4   COPY public.users (id, email, password) FROM stdin;
    public          postgres    false    215   �                  0    0    hours_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.hours_id_seq', 18, true);
          public          postgres    false    216                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 6, true);
          public          postgres    false    214            {           2606    17635    hours hours_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.hours
    ADD CONSTRAINT hours_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.hours DROP CONSTRAINT hours_pkey;
       public            postgres    false    217            w           2606    17625    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    215            y           2606    17623    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215               A   x�3�4�4��N�K��2Ebp�rq&����&�s�rM9̀p�9�c�i��r�b���� ��         �   x�M̽�0 ���9��ׂ:ʢ��_��!�@V�޵�|�*[�q�-*��%F�<+�!��<�Yp�"�=��0�mO�;�����J�"��g��~i~�n�xI6s���v,����/?���֖���@�?:�3�     